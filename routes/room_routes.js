//room_routes.js
const express = require('express');
const router = express.Router();
const Room = require('../models/rooms');


// This handles the "Rooms" link in your header: <a href="/room">
router.get('/room', async (req, res) => {
  try {
    const rooms = await Room.find().lean();
    res.render('customer/rooms', { rooms, title: "Rooms" }); 
  } catch (err) {
    res.status(500).send("Error fetching rooms");
  }
});

// This handles the card click: <a href="/details/moonlight">
router.get('/details/:id', async (req, res) => {
    try {
        // This looks for the "id" field in your JSON/DB (e.g., "moonlight")
        const room = await Room.findOne({ id: req.params.id }).lean(); 
        
        if (!room) return res.status(404).send("Room not found");
        
        res.render('customer/room-details', { room, title: room.roomName });
    } catch (err) {
        res.status(500).send("Error fetching room details");
    }
});

// GET /user/booking/:id
router.get('/user/booking/:id', async (req, res) => {
  try {
      const room = await Room.findOne({ id: req.params.id }).lean();
      if (!room) return res.status(404).send("Room not found");

      res.render('customer/booking', { 
          room, 
          user: req.session.user,
          title: "Book " + room.roomName
      });
  } catch (err) {
      res.status(500).send("Error loading booking page");
  }
});

module.exports = router;