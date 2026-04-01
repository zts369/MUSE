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
            const guest = await User.findOne({ id: log.guestId }).lean();
            const room = roomsData.find(r => r.id === log.roomId);
        
            return {
                ...log,
                guestName: guest ? `${guest.firstName} ${guest.lastName}` : "Unknown Guest",
                roomName: room ? room.roomName : "Unknown Room",
                // Format these nicely for the history table
                displayTime: new Date(log.timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }),
                displayClock: new Date(log.timestamp).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
            };
        }));
        
        res.render('staff/frontdeskHistory', { 
            logs: detailedLogs,
            user: req.session.user,
            title: 'Front Desk | View History Logs'
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading logs");
    }
});

module.exports = router;