const mongoose = require('mongoose');
const Group = require('./models/Group');
const GroupMember = require('./models/groupmember');
require('dotenv').config();
async function seedGroups() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing data
    await GroupMember.deleteMany({});
    await Group.deleteMany({});

    const godawari = await Group.create({
      name: 'Godawari College',
      description: 'Main College Group',
      parentGroup: null
    });
    await Group.create([
      { name: 'BBS', parentGroup: godawari._id },
      { name: 'BSCCSIT', parentGroup: godawari._id },
      { name: 'BCA', parentGroup: godawari._id },
      { name: '+2 Management', parentGroup: godawari._id },
      { name: '+2 Science', parentGroup: godawari._id }
    ]);
    console.log('Groups seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding groups:', error);
    process.exit(1);
  }
}
seedGroups();