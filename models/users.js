const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: { //note this is the user's username
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
    contact:{
        type: String,
        required: true,
        trim: true,
        maxLength: 10
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
    bookings: [{
        id: {
            type: String,
            required: true,
            unique: true
        },
        roomId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Room',   //matches the model name
            required: true
        },
        in: {
            type: Date,
            required: true
        },
        out: {
            type: Date,
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
        },
        timestamps: true
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);