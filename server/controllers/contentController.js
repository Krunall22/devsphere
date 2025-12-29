const Post = require('../models/Post');
const Poll = require('../models/Poll');
const User = require('../models/User'); // <--- Needed for Bookmarks

// @desc Create Post
const createPost = async (req, res) => {
  const { title, description, tags, image } = req.body;
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

// @desc Create Poll
const createPoll = async (req, res) => {
  const { question, options } = req.body;
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

// @desc Add Comment
const addComment = async (req, res) => {
  const { text } = req.body;
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
// ... existing code ...

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

// UPDATE EXPORTS
module.exports = { 
  createPost, createPoll, getFeed, votePost, votePoll, addComment, bookmarkPost, 
  getSingleContent 
};
