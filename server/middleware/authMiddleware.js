const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🛡️ 1. Protect Middleware (Verify JWT)
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// 👑 2. Admin Middleware (Check Role)
const admin = (req, res, next) => {
  // Checks if user exists and has the 'admin' role
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({ message: '⛔ Not authorized as an admin' });
  }
};

// 🛡️ 3. Export at the VERY END (Fixes your ReferenceError)
module.exports = { protect, admin };