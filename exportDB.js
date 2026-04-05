const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Models
const User = require('./models/users'); 
const Room = require('./models/rooms'); 
const Log = require('./models/logs');

const connectionURI = 'mongodb://localhost:27017/hotel-reservation';

async function exportCollection(model, fileName) {
    try {
        // Fetch all documents as plain JavaScript objects, excluding the MongoDB specific `_id` and `__v`
        const data = await model.find().select('-_id -__v').lean();
        
        // Convert to properly formatted JSON with indentation
        const jsonStr = JSON.stringify(data, null, 4);
        
        // Write to the corresponding JSON file in the data folder
        const filePath = path.join(__dirname, 'data', fileName);
        fs.writeFileSync(filePath, jsonStr, 'utf-8');
        
        console.log(`✅ Successfully exported ${data.length} records to ${fileName}`);
    } catch (err) {
        console.error(`❌ Error exporting ${fileName}:`, err);
    }
}

async function runExport() {
    try {
        await mongoose.connect(connectionURI);
        console.log('🍃 MongoDB Connected for Exporting...');

        // Export all your collections
        await exportCollection(Room, 'rooms.json');
        await exportCollection(User, 'users.json');
        await exportCollection(Log, 'logs.json');

        console.log('🎉 All databsae records successfully saved to your JSON files!');
        process.exit(0); // Close the script cleanly
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
}

runExport();
