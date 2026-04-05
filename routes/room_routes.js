//room_routes.js
const express = require('express');
const router = express.Router();
const Room = require('../models/rooms');


// This handles the "Rooms" link in your header: <a href="/room">
router.get('/room', async (req, res) => {
  try {
    const rooms = await Room.find({ isAvailable: true }).lean();
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

// ADMIN ROOM
router.get('/admin/management', async (req, res) => {
  try {
    const rooms = await Room.find().lean();
    res.render('admin/adminHome', { 
      rooms, 
      user: req.session.user,
      title: "Admin | Room Management" }); 
  } catch (err) {
    res.status(500).send("Error fetching rooms");
  }
});

// POST /admin/rooms/add
router.post('/admin/rooms/add', async (req, res) => {
  try {
    console.log('[ADD ROOM] req.body:', req.body);
    const { roomName, category, price, sqm, beds, bath, maxGuests, description, longerDescription, amenities, imageUrls, isAvailable } = req.body;
    const id = roomName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();

    const newRoom = new Room({
      id,
      roomName,
      category,
      price: parseFloat(price),
      sqm: parseFloat(sqm),
      beds: parseInt(beds),
      bath: parseInt(bath),
      maxGuests: parseInt(maxGuests),
      description,
      longerDescription,
      amenities: amenities ? amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
      imageUrl: imageUrls ? imageUrls.split('\n').map(u => u.trim()).filter(Boolean) : [],
      isAvailable: isAvailable === 'true'
    });

    await newRoom.save();
    res.redirect('/admin/management');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding room: " + err.message);
  }
});

// POST /admin/rooms/edit/:mongoId
router.post('/admin/rooms/edit/:mongoId', async (req, res) => {
  try {
    const { roomName, category, price, sqm, beds, bath, maxGuests, description, longerDescription, amenities, imageUrls, isAvailable } = req.body;

    await Room.findByIdAndUpdate(req.params.mongoId, {
      roomName,
      category,
      price: parseFloat(price),
      sqm: parseFloat(sqm),
      beds: parseInt(beds),
      bath: parseInt(bath),
      maxGuests: parseInt(maxGuests),
      description,
      longerDescription,
      amenities: amenities ? amenities.split(',').map(a => a.trim()).filter(Boolean) : [],
      imageUrl: imageUrls ? imageUrls.split('\n').map(u => u.trim()).filter(Boolean) : [],
      isAvailable: isAvailable === 'true'
    });

    res.redirect('/admin/management');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error updating room: " + err.message);
  }
});

// POST /admin/rooms/delete/:mongoId
router.post('/admin/rooms/delete/:mongoId', async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.mongoId);
    res.redirect('/admin/management');
  } catch (err) {
    console.error(err);
    res.status(500).send("Error deleting room");
  }
});

module.exports = router;