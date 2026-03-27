const mongoose = require('mongoose');

// Booking Sub-schema
const bookingSchema = new mongoose.Schema({
    id: {
        type: String, 
        required: true
    },
    roomId: { 
        type: String, // Changed from ObjectId to String to match "moonlight", "lunar", etc.
        required: true 
    },
    in: { 
        type: String, // Changed from Date to String to match "2024-07-01"
        required: true 
    },
    out: { 
        type: String, // Changed from Date to String to match "2024-07-01"
        required: true 
    },
    adults: { 
        type: Number, 
        required: true, 
        min: 1 
    },
    children: { 
        type: Number, 
        required: true, 
        min: 0 
    },
    status: { 
        type: String, 
        required: true, 
        enum: ['Reserved', 'Checked-In', 'Checked-Out', 'Cancelled'], 
        default: 'Reserved' 
    }
}, {
    timestamps: true
});

// User Schema
const userSchema = new mongoose.Schema({
    id: { 
        type: String, 
        required: true, 
        unique: true 
    }, // This holds your username like "iDing35"
    firstName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    lastName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true, 
        lowercase: true 
    },
    contact: { 
        type: String, 
        required: true, 
        trim: true, 
        maxLength: 11 // Corrected to match your 11-digit JSON numbers
    },
    password: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        required: true, 
        enum: ['guest', 'staff','admin'], 
        default: 'guest' 
    },
    bookings: [bookingSchema] 
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);