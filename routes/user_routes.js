// routes/user_routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/users');

// Fix: Change 'app' to 'router'
router.get('/sign-up', (req, res) => {
  res.render('sign-up');
});

router.post('/login', async (req, res) => {
    const { identifier, password } = req.body;

    try {
        // Find user where either email OR id (username) matches the identifier
        const user = await User.findOne({
            $or: [
                { email: identifier },
                { id: identifier }
            ]
        }).lean();

        if (user && user.password === password) {
            req.session.user = user;
            
            // Redirect based on role
            if (user.type === 'admin') return res.redirect('/admin/management');
            if (user.type === 'staff') return res.redirect('/staff/reservations');
            return res.redirect('/user/home');
        } else {
            res.send("Invalid credentials. <a href='/'>Try again</a>");
        }
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Error logging out");
        }
        res.redirect('sign-up');
    });
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

router.get('/admin/reports', async (req, res) => {
    try {
        const employees = await User.find({ type: 'admin' }).lean();
        res.render('admin/adminReports', { 
            user: req.session.user, 
            title: 'Admin | Reports' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching employee directory");
    }
});

// 2. STAFF VIEW: Show only Guests (for the Front Desk)
router.get('/staff/reservations', async (req, res) => {
    try {
        const guests = await User.find({ type: 'staff' }).lean();
        res.render('staff/frontdeskHome', {
            title: 'Front Desk | View Reservations',
            guests: guests // Pass the data to the template
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching guest list");
    }
});

router.get('/staff/directory', async (req, res) => {
    try {
        const guests = await User.find({ type: 'staff' }).lean();
        res.render('staff/frontdeskGuestDirectory', { 
            user: req.session.user, 
            title: 'Front Desk | Guest Directory' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching guest list");
    }
});

router.get('/staff/history', async (req, res) => {
    try {
        const guests = await User.find({ type: 'staff' }).lean();
        res.render('staff/frontdeskHistory', {
            title: 'Front Desk | History',
            guests: guests // Pass the data to the template
        });
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



router.get('/user/profile/:id', async (req, res) => {
    try {
        // Find the user by your custom 'id' string
        const user = await User.findOne({ id: req.params.id }).lean();
        
        if (!user) return res.status(404).send("User not found");
        
        // Render a profile view, passing the user data and their bookings
        res.render('customer/profile', { 
            user, 
            bookings: user.bookings,
            title: `${user.firstName}'s Profile`
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading profile");
    }
});

module.exports = router;