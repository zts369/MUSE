const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const MongoStore = require('connect-mongo').default;

const User = require('./models/users'); 
const Room = require('./models/rooms'); 

const app = express();
const PORT = 3000;
const connectionURI = 'mongodb://localhost:27017/hotel-reservation';

// 1. Static Files & Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/img', express.static(path.join(__dirname, 'img')));

app.use(session({
  secret: 'potato',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ 
      mongoUrl: connectionURI,
      collectionName: 'sessions'
  }),
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

// Pass user data to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// 3. Handlebars Configuration
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  helpers: {
    toLowerCase: function (str) {
      return str ? str.toLowerCase().replace(/\s+/g, '').replace('-', '') : '';
    },
    formatPrice: (price) => {
      if (typeof price !== 'number') return price;
      return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    eq: (a, b) => a === b,
    or: (a, b) => a || b
  }
});

app.engine('hbs', hbs.engine); 
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// 4. Seeding Functions
async function seedData(model, filePath) {
  try {
    const count = await model.countDocuments();
    if (count === 0) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      // ordered: false means "Keep going even if one fails"
      await model.insertMany(data, { ordered: false }); 
      console.log(`✅ ${model.modelName} data seeded successfully.`);
    }
  } catch (err) {
    console.log(`⚠️ Note: Some records in ${model.modelName} were skipped or already exist.`);
  }
}
// 5. Routes
const userRoutes = require('./routes/user_routes');
const roomRoutes = require('./routes/room_routes');

app.get('/', (req, res) => {
  res.render('sign-up');
});

app.use('/', userRoutes);
app.use('/', roomRoutes);

// 6. Database Connection
mongoose.connect(connectionURI)
  .then(() => {
    console.log('🍃 MongoDB Connected');
    app.listen(PORT, async () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      
      // Seed both Rooms and Users
      await seedData(Room, path.join(__dirname, 'data', 'rooms.json'));
      await seedData(User, path.join(__dirname, 'data', 'users.json'));
    });
  })
  .catch(err => console.log(err));