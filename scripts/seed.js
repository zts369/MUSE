// Run with: node scripts/seed.js
// WARNING: This will DELETE all existing data and re-import from JSON files.

const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

const Room = require('../models/rooms');
const User = require('../models/users');
const Log  = require('../models/logs');

const connectionURI = 'mongodb://localhost:27017/hotel-reservation';

async function seed(model, filePath) {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    await model.deleteMany({});
    await model.insertMany(data, { ordered: false });
    console.log(`✅ ${model.modelName}: deleted old data, inserted ${data.length} records.`);
}

mongoose.connect(connectionURI)
    .then(async () => {
        console.log('🍃 MongoDB connected\n');

        await seed(Room, path.join(__dirname, '../data/rooms.json'));
        await seed(User, path.join(__dirname, '../data/users.json'));
        await seed(Log,  path.join(__dirname, '../data/logs.json'));

        console.log('\n🎉 All collections re-seeded successfully.');
        mongoose.disconnect();
    })
    .catch(err => {
        console.error('❌ Connection error:', err);
        process.exit(1);
    });
