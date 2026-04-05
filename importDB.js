const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const User = require('./models/users'); 
const Room = require('./models/rooms'); 
const Log = require('./models/logs');

const connectionURI = 'mongodb://localhost:27017/hotel-reservation';

async function importCollection(model, fileName) {
    try {
        const filePath = path.join(__dirname, 'data', fileName);
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️ file ${fileName} not found, skipping.`);
            return;
        }

        // 1. Delete everything currently in the database for this collection
        await model.deleteMany({});
        
        // 2. Read the JSON file
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        // 3. Insert all the records
        if(data.length > 0) {
            await model.insertMany(data, { ordered: false });
            console.log(`✅ Successfully imported ${data.length} records into ${model.modelName} collection`);
        } else {
            console.log(`⚠️ ${fileName} is empty, collection cleared.`);
        }
    } catch (err) {
        console.error(`❌ Error importing ${fileName}:`, err);
    }
}

async function runImport() {
    try {
        await mongoose.connect(connectionURI);
        console.log('🍃 MongoDB Connected for Importing...');

        await importCollection(Room, 'rooms.json');
        await importCollection(User, 'users.json');
        await importCollection(Log, 'logs.json');

        console.log('🎉 Your local MongoDB has been forcefully synced with the JSON files!');
        process.exit(0);
    } catch (err) {
        console.error('Database connection error:', err);
        process.exit(1);
    }
}

runImport();
