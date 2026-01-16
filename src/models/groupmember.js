const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
    groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group',
        required: true
    },
    groupName: {
        type: String,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['member', 'admin'],
        default: 'member'
    }
}, { timestamps: true });

module.exports = mongoose.model('GroupMember', groupMemberSchema);
