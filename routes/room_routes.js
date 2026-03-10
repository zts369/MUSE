// routes/room_routes.js
const express = require('express');
const router = express.Router();
const Room = require('../models/rooms');

// Root route → redirect to /rooms
router.get('/', (req, res) => {
  res.redirect('/rooms');
});

// Existing route to list rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find().lean();
    res.render('rooms', { rooms });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching rooms");
  }
});

module.exports = router;
