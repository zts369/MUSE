//room_routes.js
const express = require('express');
const router = express.Router();
const Room = require('../models/rooms');


// This will now be: localhost:3000/rooms/
router.get('/room', async (req, res) => {
  try {
    const rooms = await Room.find().lean();
    res.render('customer/rooms', { rooms }); // Relative to 'views' folder
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching rooms");
  }
});

// This will now be: localhost:3000/rooms/details/:id
router.get('/details/:id', async (req, res) => {
    try {
        const room = await Room.findOne({ id: req.params.id }).lean();
        if (!room) return res.status(404).send("Room not found");
        res.render('customer/room-details', { room });
    } catch (err) {
        res.status(500).send("Error fetching room details");
    }
});

module.exports = router;