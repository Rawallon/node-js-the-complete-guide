const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middleware/auth');

const {
  getPosts,
  postPost,
  getSinglePost,
  updatePost,
  deletePost,
} = require('../controllers/feed');

const router = express.Router();

// /feed/posts
router.get('/posts', isAuth, getPosts);

router.get('/post/:postId', isAuth, getSinglePost);

router.post(
  '/post',
  isAuth,
  body('title').trim().isLength({ min: 5 }),
  body('content').trim().isLength({ min: 5 }),
  postPost,
);

router.put(
  '/post/:postId',
  isAuth,
  body('title').trim().isLength({ min: 5 }),
  body('content').trim().isLength({ min: 5 }),
  updatePost,
);

router.delete('/post/:postId', isAuth, deletePost);

module.exports = router;
