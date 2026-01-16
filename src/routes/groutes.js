const express = require('express');
const Group = require('../models/Group');
const GroupMember = require('../models/groupmember');
const authMiddleware = require('../middleware/auth');
const router = express.Router();


router.get('/root', async (req, res) => {
    try {
        const rootGroup = await Group.findOne({ parentGroup: null });
        if (!rootGroup) {
            return res.status(404).json({ error: 'Root group not found' });
        }
        res.json({ group: rootGroup });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/:id', async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate('parentGroup');
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        res.json({ group });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/:id/children', async (req, res) => {
    try {
        const children = await Group.find({ parentGroup: req.params.id });
        res.json({ children });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


router.get('/:id/role', authMiddleware, async (req, res) => {
    try {
        const membership = await GroupMember.findOne({
            groupId: req.params.id,
            userId: req.user.userId
        });
        res.json({ role: membership ? membership.role : null });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});


router.post('/:id/join', authMiddleware, async (req, res) => {
    try {
        const { role } = req.body;
        const existing = await GroupMember.findOne({
            groupId: req.params.id,
            userId: req.user.userId
        });

        if (existing) {
            existing.role = role || 'member';
            await existing.save();
            return res.json({ message: 'Membership updated', member: existing });
        }

        const User = require('../models/user');
        const Group = require('../models/Group');

        const user = await User.findById(req.user.userId);
        const group = await Group.findById(req.params.id);

        const member = await GroupMember.create({
            groupId: req.params.id,
            groupName: group.name,
            userId: req.user.userId,
            userName: user.name,
            role: role || 'member'
        });
        res.status(201).json({ message: 'Joined group', member });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


router.delete('/:id/leave', authMiddleware, async (req, res) => {
    try {
        await GroupMember.findOneAndDelete({
            groupId: req.params.id,
            userId: req.user.userId
        });
        res.json({ message: 'Left group' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
