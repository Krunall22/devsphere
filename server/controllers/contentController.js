const Post = require('../models/Post');
const Poll = require('../models/Poll');
const User = require('../models/User');
const Filter = require('bad-words'); 

const filter = new Filter();

// 2. Create Poll (RESTORED - Fixes the ReferenceError)
const createPoll = async (req, res) => {
  const { question, options } = req.body;
  if (filter.isProfane(question)) {
    return res.status(400).json({ message: "⚠️ Question contains inappropriate language." });
  }
  try {
    const formattedOptions = options.map(opt => ({ optionText: opt, votes: 0 }));
    const poll = await Poll.create({
      user: req.user._id,
      question,
      options: formattedOptions,
    });
    res.status(201).json(poll);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Get Feed
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

// 4. Delete Post (Owner or Admin Master Control)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() === req.user._id.toString() || req.user.role === 'admin') {
      await post.deleteOne();
      res.json({ message: "Content removed successfully" });
    } else {
      res.status(401).json({ message: "Not authorized" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// 5. User Posts
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.params.userId }).sort({ createdAt: -1 });
    const polls = await Poll.find({ user: req.params.userId }).sort({ createdAt: -1 });
    const content = [...posts.map(p => ({...p._doc, type: 'post'})), ...polls.map(p => ({...p._doc, type: 'poll'}))]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(content);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// 🛡️ Create Post with Profanity Check
const createPost = async (req, res) => {
  const { title, description, tags, image } = req.body;
  
  if (filter.isProfane(title) || (description && filter.isProfane(description))) {
    return res.status(400).json({ message: "⚠️ Inappropriate language detected." });
  }

  try {
    const post = await Post.create({
      user: req.user._id,
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


// Placeholder logic for voting and comments
const votePost = async (req, res) => res.json({ message: "Vote post logic" });
const votePoll = async (req, res) => res.json({ message: "Vote poll logic" });
const addComment = async (req, res) => res.json({ message: "Comment logic" });
const bookmarkPost = async (req, res) => res.json({ message: "Bookmark logic" });
const getSingleContent = async (req, res) => res.json({ message: "Single content logic" });

module.exports = { 
  createPost, createPoll, getFeed, votePost, votePoll, 
  addComment, bookmarkPost, getSingleContent, deletePost, getUserPosts 
};