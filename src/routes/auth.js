const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { z } = require('zod');
const router = express.Router();
const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long")

})
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required")
});
router.post('/signup', async (req, res) => {
  try {
    const validated = signupSchema.parse(req.body);
    const { name, email, password } = validated;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('Signup failed: User already exists for email', email);
      return res.status(400).json({ error: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });


    const Group = require('../models/Group');
    const GroupMember = require('../models/groupmember');


    const allGroups = await Group.find({});


    const memberships = allGroups.map(group => ({
      groupId: group._id,
      groupName: group.name,
      userId: user._id,
      userName: user.name,
      role: 'member'
    }));

    if (memberships.length > 0) {
      await GroupMember.insertMany(memberships);
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Signup Error:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});
router.post('/login', async (req, res) => {
  try {
    const validated = loginSchema.parse(req.body);
    const { email, password } = validated;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors[0].message });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
