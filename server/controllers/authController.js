const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc Register User
const registerUser = async (req, res) => {
  const { name, email, password, profilePic } = req.body; // <--- Add profilePic
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ 
      name, 
      email, 
      password: hashedPassword,
      profilePic: profilePic || "" // <--- Save it to database
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic, // <--- Return it
        bookmarks: [],
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  // 👇 ADD THIS BLOCK CHECK
  if (user && user.isBlocked) {
    return res.status(403).json({ message: "Your account has been blocked. Contact Admin." });
  }

  // ... rest of the login code (password check, token generation)
};
// @desc Update User Profile
const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    if (req.body.profilePic) {
      user.profilePic = req.body.profilePic;
    }
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(req.body.password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      profilePic: updatedUser.profilePic,
      bookmarks: updatedUser.bookmarks,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// @desc Get User Profile
const getUserProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
      bookmarks: user.bookmarks,
    });
  } else {
    res.status(404).json({ message: 'User not found' });
  }
};

// 👤 Get User Profile by ID (Fixes 404 in image_128cef.png)
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 🤝 Follow/Unfollow User
const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) return res.status(404).json({ message: "User not found" });

    if (currentUser.following.includes(req.params.id)) {
      // Unfollow logic
      currentUser.following = currentUser.following.filter(id => id.toString() !== req.params.id);
      userToFollow.followers = userToFollow.followers.filter(id => id.toString() !== req.user._id.toString());
    } else {
      // Follow logic
      currentUser.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
    }

    await currentUser.save();
    await userToFollow.save();
    res.json({ message: "Follow status updated" });
  } catch (error) {
    res.status(500).json({ message: "Follow action failed" });
  }
};

// 🛡️ Final Exports (Make sure they match the names above!)
module.exports = { 
  registerUser, 
  loginUser, 
  updateUserProfile, 
  getUserProfile, 
  getUserById, 
  followUser 
};