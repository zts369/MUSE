// routes/room_routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/users');

// Root route → redirect to /users
router.get('/', (req, res) => {
  res.redirect('/users');
});

// Existing route to list users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().lean();
    res.render('users', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching users");
  }
});

