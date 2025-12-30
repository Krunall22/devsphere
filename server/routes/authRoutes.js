const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { getUserById } = require('../controllers/authController');
const { followUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile); // <--- Edit Profile Route
router.get('/profile', protect, getUserProfile);    // <--- Get Fresh Data Route
router.get('/:id', getUserById);
router.put('/follow/:id', protect, followUser);


// Add this route to search users by name
router.get('/search', protect, async (req, res) => {
  const keyword = req.query.q ? {
    name: {
      $regex: req.query.q,
      $options: 'i', // Case insensitive
    },
  } : {};

  const users = await User.find({ ...keyword }).select('-password');
  res.json(users);
});




module.exports = router;