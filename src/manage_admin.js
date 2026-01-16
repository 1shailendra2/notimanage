const mongoose = require('mongoose');
const User = require('./models/user');
const Group = require('./models/Group');
const GroupMember = require('./models/groupmember');
require('dotenv').config();
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('Connected to MongoDB');

        // 1. List Users
        const users = await User.find({});
        console.log('\n--- USERS ---');
        users.forEach((u, i) => console.log(`${i + 1}. ${u.name} (${u.email})`));

        // 2. Select User
        const userIndex = await question('\nEnter number of user to make admin: ');
        const selectedUser = users[parseInt(userIndex) - 1];
        if (!selectedUser) throw new Error('Invalid user selection');

        // 3. List Groups
        const groups = await Group.find({});
        console.log('\n--- GROUPS ---');
        groups.forEach((g, i) => console.log(`${i + 1}. ${g.name}`));

        // 4. Select Group
        const groupIndex = await question('\nEnter number of group to assign admin to: ');
        const selectedGroup = groups[parseInt(groupIndex) - 1];
        if (!selectedGroup) throw new Error('Invalid group selection');

        // 5. Assign Role
        const existing = await GroupMember.findOne({
            userId: selectedUser._id,
            groupId: selectedGroup._id
        });

        if (existing) {
            existing.role = 'admin';
            await existing.save();
            console.log(`\nUpdated ${selectedUser.name} to ADMIN of ${selectedGroup.name}`);
        } else {
            await GroupMember.create({
                userId: selectedUser._id,
                groupId: selectedGroup._id,
                role: 'admin'
            });
            console.log(`\nCreated rule: ${selectedUser.name} is now ADMIN of ${selectedGroup.name}`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await mongoose.connection.close();
        rl.close();
        process.exit(0);
    }
}

main();
