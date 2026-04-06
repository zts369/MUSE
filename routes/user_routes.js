// routes/user_routes.js
const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Room = require('../models/rooms');
const Log  = require('../models/logs');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// CORRECT PATH: Go up one level, into 'data', then 'rooms.json'
const roomsPath = path.join(__dirname, '../data/rooms.json');

// Wrap in a try-catch so the server doesn't crash if the file moves again
let rooms = [];
try {
    rooms = JSON.parse(fs.readFileSync(roomsPath, 'utf8'));
    console.log("✅ rooms.json loaded successfully from data folder");
} catch (err) {
    console.error("❌ Could not load rooms.json. Path attempted:", roomsPath);
}

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

        if (user && await bcrypt.compare(password, user.password)) {
            req.session.user = user;

            // Save session to DB before redirecting so the next request sees the user
            req.session.save((err) => {
                if (err) return res.status(500).send("Session error");
                if (user.type === 'admin') return res.redirect('/admin/management');
                if (user.type === 'staff') return res.redirect('/staff/reservations');
                return res.redirect('/user/home');
            });
        } else {
            res.render('sign-up', { 
                error: "Invalid username, email, or password",
                identifier // Pass this back so the user doesn't have to re-type it
            });
        }
    } catch (err) {
        res.status(500).send("Server Error");
    }
});


router.post('/register', async (req, res) => {
    // These names must match the 'name' attribute in your HTML
    const { firstName, lastName, username, email, contact, password, confirmPassword } = req.body;

    try {
        // 1. Check if passwords match
        if (password !== confirmPassword) {
            return res.render('sign-up', { error: "Passwords do not match", ...req.body });
        }

        // 2. Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { id: username }] });
        if (existingUser) {
            return res.render('sign-up', { 
                error: "Email or username already in use",
                ...req.body 
            });
        }

        // 3. Create the Guest
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({
            id: username,
            firstName,
            lastName,
            email,
            contact,
            password: hashedPassword,
            type: 'guest', // Automatically set as guest
            bookings: []
        });

        await newUser.save();
        
        // 4. Redirect to login or home after success
        res.redirect('/?success=registered'); 
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Error logging out");
        }
        res.redirect('/sign-up');
    });
});

// 1. ADMIN VIEW
router.get('/admin/reports', async (req, res) => {
    try {
        const [guests, rooms] = await Promise.all([
            User.find({ type: 'guest', 'bookings.0': { $exists: true } }).lean(),
            Room.find().lean()
        ]);

        // Build a roomId -> roomName lookup
        const roomNameMap = {};
        rooms.forEach(r => { roomNameMap[r.id] = r.roomName; });

        // Aggregate by month, then by room within each month
        const monthMap = {};
        let grandTotal = 0;
        let grandBookings = 0;

        guests.forEach(guest => {
            (guest.bookings || []).forEach(booking => {
                if (!booking.in) return;
                const date = new Date(booking.in);
                const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const label = date.toLocaleString('en-PH', { month: 'long', year: 'numeric' });
                const revenue = booking.price || 0;
                const roomId = booking.roomId || 'unknown';

                if (!monthMap[key]) monthMap[key] = { label, bookings: 0, revenue: 0, rooms: {} };

                monthMap[key].bookings += 1;
                monthMap[key].revenue += revenue;

                if (!monthMap[key].rooms[roomId]) {
                    monthMap[key].rooms[roomId] = {
                        roomName: roomNameMap[roomId] || roomId,
                        bookings: 0,
                        revenue: 0
                    };
                }
                monthMap[key].rooms[roomId].bookings += 1;
                monthMap[key].rooms[roomId].revenue += revenue;

                grandTotal += revenue;
                grandBookings += 1;
            });
        });

        const fmt = n => n.toLocaleString('en-PH', { minimumFractionDigits: 2 });

        const monthlyData = Object.keys(monthMap).sort().map(key => {
            const m = monthMap[key];
            const roomRows = Object.values(m.rooms)
                .sort((a, b) => b.revenue - a.revenue)
                .map(r => ({
                    roomName: r.roomName,
                    bookings: r.bookings,
                    revenue: fmt(r.revenue)
                }));

            return {
                month: m.label,
                bookings: m.bookings,
                revenue: fmt(m.revenue),
                rooms: roomRows
            };
        });

        res.render('admin/adminReports', {
            user: req.session.user,
            title: 'Admin | Reports',
            monthlyData,
            grandTotal: fmt(grandTotal),
            grandBookings,
            generatedDate: new Date().toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' })
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error generating report");
    }
});



// 2. STAFF VIEW: Show only Guests (for the Front Desk)

/**
 * Formats a list of guest objects with readable dates and booking counts
 * @param {Array} guests - The raw guest array from MongoDB
 * @returns {Array} - The formatted guest array for Handlebars
 */
const formatGuestData = (data) => {
    const isArray = Array.isArray(data);
    const guestsArray = isArray ? data : [data];

    const formatted = guestsArray.map(guest => {
        // Internal helper for date formatting
        const formatEntryDate = (dateValue) => {
            if (!dateValue) return "N/A";
            return new Date(dateValue).toLocaleString('en-PH', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true 
            });
        };

        if (guest.bookings && guest.bookings.length > 0) {
            guest.bookings = guest.bookings.map(booking => ({
                ...booking,
                displayIn: formatEntryDate(booking.in),
                displayOut: formatEntryDate(booking.out)
            }));
        }

        const firstBooking = guest.bookings && guest.bookings.length > 0 ? guest.bookings[0] : null;

        return {
            ...guest,
            displayIn: formatEntryDate(firstBooking ? firstBooking.in : null),
            displayOut: formatEntryDate(firstBooking ? firstBooking.out : null),
            totalBookings: guest.bookings ? guest.bookings.length : 0
        };
    });

    return isArray ? formatted : formatted[0];
};

router.get('/staff/reservations', async (req, res) => {
    try {
        //find the guests who made reservations
        const guests = await User.find({ type: 'guest' }).lean();
        res.render('staff/frontdeskHome', {
            title: 'Front Desk | View Reservations',
            guests: formatGuestData(guests) // Pass the data to the template
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error fetching guest list");
    }
});



router.get('/staff/guest-bookings/:id', async (req, res) => {
    try {
        const guestDoc = await User.findOne({ id: req.params.id }).lean();
        if (!guestDoc) return res.status(404).send("Guest not found");

        const roomsPath = path.join(__dirname, '../data/rooms.json');
        const roomsData = JSON.parse(fs.readFileSync(roomsPath, 'utf8'));

        // Merge room info into bookings
        if (guestDoc.bookings && guestDoc.bookings.length > 0) {
            guestDoc.bookings = guestDoc.bookings.map(booking => {
                const roomInfo = roomsData.find(r => 
                    r.id.trim().toLowerCase() === booking.roomId.trim().toLowerCase()
                );
                return {
                    ...booking,
                    roomName: roomInfo ? roomInfo.roomName : "Room Info Missing",
                    price: roomInfo ? roomInfo.price : 0
                };
            });
        }

        res.render('staff/guestBooking', { 
            // We pass the formatted single object as 'guest'
            guest: formatGuestData(guestDoc), 
            user: req.session.user, 
            title: 'Guest Details' 
        });
    } catch (err) {
        console.error("Route Error:", err);
        res.status(500).send("Error fetching guest details");
    }
});

router.post('/staff/update-booking-status', async (req, res) => {
    try {
        const { guestId, bookingId, status } = req.body;
        const validStatuses = ['Reserved', 'Checked-In', 'Checked-Out', 'Cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status.' });
        }

        // 1. Update the booking status in the user document
        const guest = await User.findOneAndUpdate(
            { id: guestId, 'bookings.id': bookingId },
            { $set: { 'bookings.$.status': status } },
            { new: true }
        ).lean();

        if (!guest) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }

        // 2. Find the booking to get its roomId
        const booking = guest.bookings.find(b => b.id === bookingId);

        // 3. Write a log entry
        await new Log({
            guestId,
            roomId: booking ? booking.roomId : 'unknown',
            action: status
        }).save();

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error.' });
    }
});

router.get('/staff/directory', async (req, res) => {
    try {
        const guests = await User.find({ type: 'guest' }).lean();
        res.render('staff/frontdeskGuestDirectory', { 
            user: req.session.user, 
            guests: guests, //pass the guest data to the template
            title: 'Front Desk | Guest Directory' 
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

router.post('/user/profile/:id/edit', async (req, res) => {
    try {
        const { firstName, lastName, email, contact, password, confirmPassword } = req.body;

        const updates = { firstName, lastName, email, contact };

        if (password) {
            if (password !== confirmPassword) {
                return res.redirect(`/user/profile/${req.params.id}?error=passwords_mismatch`);
            }
            updates.password = await bcrypt.hash(password, saltRounds);
        }

        const updatedUser = await User.findOneAndUpdate(
            { id: req.params.id },
            { $set: updates },
            { new: true }
        ).lean();

        if (!updatedUser) return res.status(404).send("User not found");

        // Refresh session with updated data
        req.session.user = { ...req.session.user, ...updates };
        req.session.save((err) => {
            if (err) return res.status(500).send("Session error");
            res.redirect(`/user/profile/${req.params.id}`);
        });

    } catch (err) {
        console.error(err);
        res.status(500).send("Error updating profile");
    }
});

module.exports = router;