const express = require('express');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const fs = require('fs');

const User = require('./models/users');
const Room = require('./models/rooms');
const Reservation = require('./models/reservations');
const roomRoutes = require('./routes/room_routes');

const app = express();
const PORT = 3000;

// ✅ Put ALL helpers inside the helpers object
const hbs = exphbs.create({
  extname: '.hbs',
  defaultLayout: 'main',
  layoutsDir: __dirname + '/views/layouts/',
  helpers: {
    formatPrice: (price) => {
      return price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    },
    dashcase: (str) => {
      if (!str) return '';
      return str.toString().trim().toLowerCase().replace(/\s+/g, '-');
    },
    eq: (a, b) => {
        return a === b;
    }  
  }
});

// Register this engine (don’t create a second one)
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views');

const connectionURI = 'mongodb://localhost:27017/hotel-reservation';

async function insertRoomsData(db, path) {
  try {
    const count = await db.countDocuments();
    if (count === 0) {
      const roomsData = JSON.parse(fs.readFileSync(path, 'utf-8'));
      await db.insertMany(roomsData);
      console.log(`${db.modelName} data inserted successfully`);
    } else {
      console.log(`${db.modelName} already has data. Skipping insertion.`);
    }
  } catch (err) {
    console.error(`Error inserting data into ${db.modelName}:`, err);
  }
}

mongoose.connect(connectionURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.listen(PORT, async () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  await insertRoomsData(Room, './data/rooms.json');
});

app.use('/', roomRoutes);
