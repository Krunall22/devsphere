const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Post = require('../models/Post');

// 🛡️ ALL ROUTES BELOW REQUIRE ADMIN ROLE

// 1. Get All Users (For User Management Tab)
router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
});

// 2. Block/Unblock a User
router.put('/block/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isBlocked = !user.isBlocked; // Toggle status
    await user.save();
    res.json({ message: `User ${user.name} status updated`, isBlocked: user.isBlocked });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// 3. Get ALL Posts (For Content Management Tab)
router.get('/posts', protect, admin, async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts" });
  }
});

// 4. Delete ANY Post (Use this to remove the vulgar content)
router.delete('/post/:id', protect, admin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post) {
      await post.deleteOne();
      res.json({ message: 'Content deleted by Admin' });
    } else {
      res.status(404).json({ message: 'Post not found' });
    }
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

module.exports = router;