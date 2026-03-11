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

router.get('/rooms/:id', async (req, res) => {
    try {
        const room = await Room.findOne({ id: req.params.id }).lean();
        if (!room) {
        return res.status(404).send("Room not found");
        }
        res.render('room-details', { room });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching room details");
    }
});

module.exports = router;
