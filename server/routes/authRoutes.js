const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUserProfile, getUserProfile } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, updateUserProfile); // <--- Edit Profile Route
router.get('/profile', protect, getUserProfile);    // <--- Get Fresh Data Route

module.exports = router;