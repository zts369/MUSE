const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
    guestId: {
        type: String,
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['Reserved', 'Checked-In', 'Checked-Out', 'Cancelled']
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Log', logSchema);