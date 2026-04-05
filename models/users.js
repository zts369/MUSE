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
        type: Date,
        default: Date.now,
    },
    out: {
        type: Date,
        default: Date.now,
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
    roomsCount: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 1
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        required: true,
        enum: ['Reserved', 'Checked-In', 'Checked-Out', 'Cancelled'],
        default: 'Reserved'
    },
    specialRequest: {
        type: String,
        required: false
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['card', 'hotel']
    }
}, {
    timestamps: true
});

// User Schema
const userSchema = new mongoose.Schema({
    id: { // This holds your username like "iDing35"
        type: String,
        required: true,
        unique: true
    },
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
        enum: ['guest', 'staff', 'admin'],
        default: 'guest'
    },
    cardDetails: {
        cardNumber: { type: String, required: false },
        expiryDate: { type: String, required: false },
        cvv: { type: String, required: false },
        billingAddress: { type: String, required: false }
    },
    bookings: [bookingSchema]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);