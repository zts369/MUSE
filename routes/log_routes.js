const express = require('express');
const router = express.Router();
const Log = require('../models/logs');
const User = require('../models/users'); // Import your User model
const path = require('path');
const fs = require('fs');

router.get('/staff/history', async (req, res) => {
    try {
        // 1. Get all logs from MongoDB
        const logs = await Log.find().sort({ timestamp: -1 }).lean();

        // 2. Load your JSON data for rooms
        const roomsPath = path.join(__dirname, '../data/rooms.json');
        const roomsData = JSON.parse(fs.readFileSync(roomsPath, 'utf8'));

        // 3. Merge the data
        const detailedLogs = await Promise.all(logs.map(async (log) => {
            // Find the User in MongoDB
            const guest = await User.findOne({ id: log.guestId }).lean();
            
            // Find the Room in the JSON file
            const room = roomsData.find(r => r.id === log.roomId);

            return {
                ...log,
                // Use the name from the User database, or a fallback
                guestName: guest ? `${guest.firstName} ${guest.lastName}` : "Unknown Guest",
                roomName: room ? room.roomName : "Unknown Room",
                displayTime: log.timestamp.toISOString().split('T')[0],
                displayClock: log.timestamp.toTimeString().split(' ')[0]
            };
        }));

        res.render('staff/frontdeskHome', { 
            logs: detailedLogs,
            user: req.session.user,
            title: 'View Reservations'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading logs");
    }
});

module.exports = router;