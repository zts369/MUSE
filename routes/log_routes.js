const express = require('express');
const router = express.Router();
const Log  = require('../models/logs');
const User = require('../models/users');
const Room = require('../models/rooms');

router.get('/staff/history', async (req, res) => {
    try {
        const [logs, users, rooms] = await Promise.all([
            Log.find().sort({ timestamp: -1 }).lean(),
            User.find().lean(),
            Room.find().lean()
        ]);

        // Build lookup maps
        const userMap = {};
        users.forEach(u => { userMap[u.id] = { name: `${u.firstName} ${u.lastName}`, bookings: u.bookings || [] }; });

        const roomMap = {};
        rooms.forEach(r => { roomMap[r.id] = r.roomName; });

        const fmtDate = d => d ? new Date(d).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';

        const detailedLogs = logs.map(log => {
            const guest = userMap[log.guestId] || {};

            // Find the booking that matches this log's roomId, closest to the log timestamp
            const bookings = (guest.bookings || []).filter(b => b.roomId === log.roomId);
            let booking = null;
            if (bookings.length === 1) {
                booking = bookings[0];
            } else if (bookings.length > 1) {
                // Pick the booking whose createdAt is closest to the log timestamp
                const logTime = new Date(log.timestamp).getTime();
                booking = bookings.reduce((best, b) => {
                    const diff = Math.abs(new Date(b.createdAt).getTime() - logTime);
                    const bestDiff = Math.abs(new Date(best.createdAt).getTime() - logTime);
                    return diff < bestDiff ? b : best;
                });
            }

            return {
                ...log,
                guestName:    guest.name || log.guestId,
                roomName:     roomMap[log.roomId] || log.roomId,
                displayTime:  new Date(log.timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }),
                displayClock: new Date(log.timestamp).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }),
                checkIn:      booking ? fmtDate(booking.in)  : 'N/A',
                checkOut:     booking ? fmtDate(booking.out) : 'N/A',
                bookingId:    booking ? booking.id : ''
            };
        });

        res.render('staff/frontdeskHistory', {
            logs: detailedLogs,
            user: req.session.user,
            title: 'Front Desk | History Logs'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading logs");
    }
});

module.exports = router;
