const fs = require('fs');
const path = require('path');

const io = require('../socket');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const { throwError } = require('./errorHandler');
const Post = require('../models/post');

exports.getPosts = async (req, res, next) => {
  const currPage = req.query.page || 1;
  const perPage = 2;

  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate('creator')
      .sort({ createdAt: -1 })
      .skip((currPage - 1) * perPage)
      .limit(perPage);
    res.json({
      posts: posts,
      totalItems: totalItems,
    });
  } catch (error) {
    next(error);
  }
};

exports.postPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwError('Validation failed', 422);
  }
  if (!req.file) {
    throwError('No image provided', 422);
  }

  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imageUrl: req.file.path.replace('\\', '/'),
    creator: req.userId,
  });

  try {
    const savedPost = await post.save();
    const foundUser = await User.findById(req.userId);
    foundUser.posts.push(savedPost);
    const changedUser = await foundUser.save();
    io.getIO().emit('posts', {
      action: 'create',
      post: {
        ...post._doc,
        creator: { _id: req.userId, name: changedUser.name },
      },
    });
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: { _id: foundUser._id, name: changedUser.name },
    });
  } catch (error) {
    next(error);
  }
};

exports.getSinglePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const postRet = await Post.findById(postId);
    if (!postRet) {
      throwError('Post not found', 404);
    }
    res.status(200).json({ post: postRet });
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwError('Validation failed', 422);
  }
  const { title, content, image } = req.body;
  if (!image && !req.file) {
    throwError('No image', 422);
  }
  try {
    const post = await Post.findById(postId).populate('creator');
    if (!post) {
      throwError('Could not find post', 404);
    }
    if (post.creator._id.toString() !== req.userId) {
      throwError('Not auth', 403);
    }
    let imagePath;
    if (req.file) {
      clearImage(post.imageUrl);
      imagePath = req.file.path.replace('\\', '/');
    }
    post.title = title;
    post.imageUrl = imagePath || image;
    post.content = content;
    const result = await post.save();
    io.getIO().emit('posts', { action: 'update', post: result });
    res.status(200).json({ post: result });
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId).populate('creator');
    if (!post) {
      throwError('Could not find post', 404);
    }
    if (post.creator.toString() !== req.userId) {
      throwError('Not auth', 403);
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(post._id);
    const user = await User.findById(req.userId);

    user.posts.pull(postId);
    await user.save();
    io.getIO().emit('posts', { action: 'delete', post: postId });
    res.status(200).json({ message: 'Deleted post' });
  } catch (error) {
    next(error);
  }
};

const clearImage = (filePath) => {
  if (!filePath) return;
  filePath = path.join(__dirname, '..', filePath.replace('\\', '/'));
  fs.unlink(filePath, (err) => console.error(err));
};
