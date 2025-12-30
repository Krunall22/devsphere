const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "user" }, // Can be "user" or "admin"
  isBlocked: { type: Boolean, default: false },
  profilePic: { type: String, default: "" },
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
  joinedDate: { type: Date, default: Date.now },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', userSchema);