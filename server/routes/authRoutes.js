const express = require('express');
const router = express.Router();
const User = require('../models/User'); // 🛡️ Added User model import
const { 
  registerUser, 
  loginUser, 
  updateUserProfile, 
  getUserProfile, 
  getUserById, 
  followUser,
  searchUsers // Ensure this is exported from your controller
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// 1. PUBLIC ROUTES
router.post('/register', registerUser);
router.post('/login', loginUser);

// 2. SEARCH ROUTE (Must be ABOVE /:id to prevent 404)
router.get('/search', protect, async (req, res) => {
  try {
    const keyword = req.query.q ? {
      name: {
        $regex: req.query.q,
        $options: 'i', // Case insensitive
      },
    } : {};

    const users = await User.find({ ...keyword }).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Search Error" });
  }
});

// 3. PROTECTED PROFILE ROUTES
router.put('/profile', protect, updateUserProfile); 
router.get('/profile', protect, getUserProfile);    

// 4. INTERACTION ROUTES
router.put('/follow/:id', protect, followUser);

// 5. DYNAMIC USER ROUTE (Must be LAST)
router.get('/:id', getUserById);

module.exports = router;