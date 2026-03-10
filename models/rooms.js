const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomName: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
        enum: ['room', 'suite'],
        default: 'room'
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    amenities: {
        type: [String],
        required: true,
        default: []
    },
    isAvailable: {
        type: Boolean,
        required: true,
        default: true,
    },
    sqm: {
        type: Number,
        required: true,
        min: 0,
    },
    beds: {
        type: Number,
        required: true,
        min: 0,
    },
    bath: {
        type: Number,
        required: true,
        min: 0,
    },
    maxGuests: {
        type: Number,
        required: true,
        min: 1,
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    longerDescription: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: [String],
        required: true,
        trim: true
    
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Room', roomSchema);