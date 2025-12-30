const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { 
  createPost, createPoll, getFeed, votePost, votePoll, addComment, bookmarkPost, 
  getSingleContent, deletePost, getUserPosts // Added deletePost and getUserPosts here
} = require('../controllers/contentController');

router.get('/view/:id', getSingleContent);
router.get('/feed', getFeed);
router.post('/posts', protect, createPost);
router.post('/polls', protect, createPoll);
router.put('/posts/:id/vote', protect, votePost);
router.put('/polls/:id/vote', protect, votePoll);
router.post('/posts/:id/comment', protect, addComment);
router.put('/posts/:id/bookmark', protect, bookmarkPost);

// Now deletePost is properly imported and defined
router.delete('/:id', protect, deletePost);
router.get('/user/:userId', protect, getUserPosts);

module.exports = router;