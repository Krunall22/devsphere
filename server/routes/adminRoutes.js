const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const User = require('../models/User');
const Post = require('../models/Post'); // Assuming you have a Post model

// 1. Block a User
router.put('/block/:id', protect, admin, async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isBlocked = true;
    await user.save();
    res.json({ message: `User ${user.name} has been blocked` });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

// 2. Delete ANY Post (Admin Power)
router.delete('/post/:id', protect, admin, async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    await post.deleteOne();
    res.json({ message: 'Post removed by Admin' });
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// ... imports

// 0. Get All Users (So Admin can see who to block)
router.get('/users', protect, admin, async (req, res) => {
  const users = await User.find({}); // Fetch everyone
  res.json(users);
});

// 3. Get ALL Posts (For Admin Dashboard)
router.get('/posts', protect, admin, async (req, res) => {
  const posts = await require('../models/Post').find()
    .populate('user', 'name email') // Show who posted it
    .sort({ createdAt: -1 }); // Newest first
  res.json(posts);
});

// 4. Delete ANY Post (Admin Power)
router.delete('/post/:id', protect, admin, async (req, res) => {
  const post = await require('../models/Post').findById(req.params.id);
  if (post) {
    await post.deleteOne();
    res.json({ message: 'Content deleted by Admin' });
  } else {
    res.status(404).json({ message: 'Post not found' });
  }
});

// ... existing block/delete routes
module.exports = router;