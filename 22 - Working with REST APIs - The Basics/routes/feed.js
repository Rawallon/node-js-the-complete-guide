const express = require('express');
const { getPosts, postPost } = require('../controllers/feed');

const router = express.Router();

// /feed/posts
router.get('/posts', getPosts);

router.post('/posts', postPost);

module.exports = router;
