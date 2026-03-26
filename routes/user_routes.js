// routes/user_routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/users');

// Fix: Change 'app' to 'router'
router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

// 1. ADMIN VIEW: Show only Staff and Admins
router.get('/admin/management', async (req, res) => {
    try {
        // Filter for staff/admin only
        const employees = await User.find({ type: 'admin' }).lean();
        res.render('admin/adminHome', { users: employees });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching employee directory");
    }
});

// 2. STAFF VIEW: Show only Guests (for the Front Desk)
router.get('/staff/reservations', async (req, res) => {
    try {
        // Filter for guests only
        const guests = await User.find({ type: 'staff' }).lean();
        // This matches your file: views/staff/frontdeskGuestDirectory.hbs
        res.render('staff/frontdeskHome', { guests });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching guest list");
    }
});

router.get('/user/home', async (req, res) => {
  try {
      const users = await User.find({ type: 'guest' }).lean();
      // REMEMBER: You moved this to the admin folder!
      res.render('customer/home', { users }); 
  } catch (err) {
      res.status(500).send("Error");
  }
});

router.get('/user/about', async (req, res) => {
  try {
      const users = await User.find({ type: 'guest' }).lean();
      // REMEMBER: You moved this to the admin folder!
      res.render('customer/about', { users }); 
  } catch (err) {
      res.status(500).send("Error");
  }
});



router.get('/profile/:id', async (req, res) => {
    try {
        const user = await User.findOne({ id: req.params.id }).lean();
        if (!user) return res.status(404).send("User not found");
        
        // Pass the user and their specific bookings
        res.render('customer/home', { user, bookings: user.bookings });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading profile");
    }
});

module.exports = router;