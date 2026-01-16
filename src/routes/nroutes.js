const express = require('express');
const News = require('../models/news');
const GroupMember = require('../models/groupmember');
const authMiddleware = require('../middleware/auth');
const router = express.Router();
router.get('/group/:groupId', async (req, res) => {
  try {
    const news = await News.find({ groupId: req.params.groupId })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email');
    res.json({ news });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { groupId, title, content } = req.body;
    const isAdmin = await GroupMember.findOne({
      groupId,
      userId: req.user.userId,
      role: 'admin'
    });
    if (!isAdmin) {
      return res.status(403).json({ error: 'Only admins can post news' });
    }
    const news = await News.create({
      groupId,
      title,
      content,
      postedBy: req.user.userId
    });

    await news.populate('postedBy', 'name email');
    res.status(201).json({ message: 'News posted', news });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});
module.exports = router;