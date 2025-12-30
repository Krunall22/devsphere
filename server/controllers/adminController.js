const Post = require('../models/Post');
const User = require('../models/User');

// @desc Delete ANY post (Used for 18+ content removal)
const deleteAnyPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post already deleted" });

    await post.deleteOne();
    res.json({ message: "Content removed for violating community standards" });
  } catch (error) {
    res.status(500).json({ message: "Admin Delete Failed" });
  }
};

// @desc Block/Ban a User permanently
const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = !user.isBlocked; // Toggle ban status
    await user.save();
    res.json({ message: user.isBlocked ? "User Banned" : "User Unbanned" });
  } catch (error) {
    res.status(500).json({ message: "Block Action Failed" });
  }
};

module.exports = { deleteAnyPost, blockUser };