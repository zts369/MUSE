const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');

const User = require('./models/users'); 
const Room = require('./models/rooms'); 

const app = express();
const PORT = 3000;

// 1. Static Files & Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/style', express.static(path.join(__dirname, 'style')));
app.use('/scripts', express.static(path.join(__dirname, 'scripts')));
app.use('/img', express.static(path.join(__dirname, 'img')));

// 2. Handlebars Configuration
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views/layouts'),
  helpers: {
    formatPrice: (price) => {
      if (typeof price !== 'number') return price;
      return price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    },
    eq: (a, b) => a === b
  }
});

app.engine('hbs', hbs.engine); 
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// 3. Routes
const userRoutes = require('./routes/user_routes');
const roomRoutes = require('./routes/room_routes');

// Landing page
app.get('/', (req, res) => {
  res.render('sign-up');
});

// Use '/' so the paths inside the files are exactly what you see in the browser
app.use('/', userRoutes);
app.use('/', roomRoutes);



// 4. Database & Seeding
const connectionURI = 'mongodb://localhost:27017/hotel-reservation';

async function insertRoomsData(model, filePath) {
  try {
    const count = await model.countDocuments();
    if (count === 0) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      await model.insertMany(data);
      console.log(`${model.modelName} data seeded.`);
    }
  } catch (err) {
    console.error(`Error seeding ${model.modelName}:`, err);
  }
}

mongoose.connect(connectionURI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(PORT, async () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      await insertRoomsData(Room, path.join(__dirname, 'data', 'rooms.json'));
    });
  })
  .catch(err => console.log(err));