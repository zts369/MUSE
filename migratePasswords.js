const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/users'); 
const saltRounds = 10;

const connectionURI = 'mongodb://localhost:27017/hotel-reservation';

async function migrate() {
    try {
        await mongoose.connect(connectionURI);
        console.log('🍃 MongoDB Connected for migration...');

        const users = await User.find({});
        console.log(`🔍 Checking ${users.length} users...`);

        let migratedCount = 0;

        for (const user of users) {
            // If the password doesn't start with '$2a$' it's likely plain-text
            if (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$')) {
                console.log(`➡️ Hashing password for user: ${user.id} (${user.type})`);
                user.password = await bcrypt.hash(user.password, saltRounds);
                await user.save();
                migratedCount++;
            }
        }

        console.log(`✅ Finished! Migrated ${migratedCount} users.`);
        process.exit(0);
    } catch (err) {
        console.error('❌ Migration Error:', err);
        process.exit(1);
    }
}

migrate();
