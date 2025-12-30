const Post = require('../models/Post');
const Poll = require('../models/Poll');
const User = require('../models/User');
const Filter = require('bad-words'); // <--- 1. Import the Filter library

// Initialize the filter
const filter = new Filter();
// Optional: Add specific custom words you want to block
// filter.addWords('badword1', 'badword2'); 

// @desc Create Post (SECURED)
const createPost = async (req, res) => {
  const { title, description, tags, image } = req.body;

  // 🛡️ SECURITY CHECK: Profanity Filter
  if (filter.isProfane(title)) {
    return res.status(400).json({ message: "⚠️ Title contains inappropriate language." });
  }
  if (description && filter.isProfane(description)) {
    return res.status(400).json({ message: "⚠️ Description contains inappropriate language." });
  }

  try {
    const post = await Post.create({
      user: req.user.id,
      title,
      description,
      tags: tags ? tags.split(',') : [],
      image: image || "",
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Create Poll (SECURED)
const createPoll = async (req, res) => {
  const { question, options } = req.body;

  // 🛡️ SECURITY CHECK: Profanity Filter
  if (filter.isProfane(question)) {
    return res.status(400).json({ message: "⚠️ Question contains inappropriate language." });
  }
  // Check every poll option
  for (let opt of options) {
    if (filter.isProfane(opt)) {
      return res.status(400).json({ message: "⚠️ Poll options contain inappropriate language." });
    }
  }

  try {
    const formattedOptions = options.map(opt => ({ optionText: opt, votes: 0 }));
    const poll = await Poll.create({
      user: req.user.id,
      question,
      options: formattedOptions,
    });
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Get Feed (Mixed Posts & Polls)
const getFeed = async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name profilePic').lean();
    const polls = await Poll.find().populate('user', 'name profilePic').lean();

    const feed = [...posts.map(p => ({ ...p, type: 'post' })), ...polls.map(p => ({ ...p, type: 'poll' }))]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(feed);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Vote on Post
const votePost = async (req, res) => {
  const { action } = req.body;
  const userId = req.user.id;
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.upvotes = post.upvotes.filter(id => id.toString() !== userId);
    post.downvotes = post.downvotes.filter(id => id.toString() !== userId);

    if (action === 'upvote') post.upvotes.push(userId);
    if (action === 'downvote') post.downvotes.push(userId);

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Vote on Poll
const votePoll = async (req, res) => {
  const { optionIndex } = req.body;
  const userId = req.user.id;
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    if (poll.votedUsers.includes(userId)) {
      return res.status(400).json({ message: 'Already voted' });
    }

    poll.options[optionIndex].votes += 1;
    poll.votedUsers.push(userId);
    await poll.save();
    res.json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Add Comment (SECURED)
const addComment = async (req, res) => {
  const { text } = req.body;

  // 🛡️ SECURITY CHECK
  if (filter.isProfane(text)) {
    return res.status(400).json({ message: "⚠️ Comment contains inappropriate language." });
  }

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const newComment = { user: req.user.id, text, date: Date.now() };
    post.comments.unshift(newComment);
    await post.save();
    res.json(post);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc Bookmark Post
const bookmarkPost = async (req, res) => {
  const userId = req.user.id;
  const postId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (user.bookmarks.includes(postId)) {
      user.bookmarks = user.bookmarks.filter(id => id.toString() !== postId);
    } else {
      user.bookmarks.push(postId);
    }
    await user.save();
    res.json(user.bookmarks);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc Get Single Post or Poll by ID
const getSingleContent = async (req, res) => {
  try {
    let content = await Post.findById(req.params.id).populate('user', 'name profilePic').lean();
    let type = 'post';

    if (!content) {
      content = await Poll.findById(req.params.id).populate('user', 'name profilePic').lean();
      type = 'poll';
    }

    if (!content) return res.status(404).json({ message: 'Content not found' });

    res.json({ ...content, type });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc Delete Post (Owner or Admin)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check ownership: Is the logged-in user the owner? (Or an Admin?)
    if (post.user.toString() === req.user._id.toString() || req.user.role === 'admin') {
      await post.deleteOne();
      res.json({ message: "Post removed successfully" });
    } else {
      res.status(401).json({ message: "Not authorized to delete this post" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// ... existing imports and functions ...

// @desc Get Public User Profile by ID
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password'); // ❌ Hide Password
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc Get Posts by Specific User
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).sort({ createdAt: -1 });
    const polls = await Poll.find({ user: req.params.userId }).sort({ createdAt: -1 });
    
    // Combine and Sort
    const content = [...posts.map(p => ({...p._doc, type: 'post'})), ...polls.map(p => ({...p._doc, type: 'poll'}))]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};




// ✅ CLEAN EXPORTS
module.exports = { 
  createPost, 
  createPoll, 
  getFeed, 
  votePost, 
  votePoll, 
  addComment, 
  bookmarkPost, 
  getSingleContent, 
  deletePost,
  registerUser,
  loginUser, 
  getUserById,
  getUserPosts
};