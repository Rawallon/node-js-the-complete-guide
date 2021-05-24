const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');
const User = require('../models/user');
const { throwError } = require('./errorHandler');
const Post = require('../models/post');

exports.getPosts = (req, res, next) => {
  const currPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.json({
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => next(err));
};

exports.postPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwError('Validation failed', 422);
  }
  if (!req.file) {
    throwError('No image provided', 422);
  }

  const title = req.body.title;
  const imageUrl = req.file.path.replace('\\', '/');
  const content = req.body.content;
  let creator;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });

  post
    .save()
    .then((post) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save;
    })
    .then((result) => {
      res.status(201).json({
        message: 'Post created successfully!',
        post: post,
        creator: { _id: creator._id, name: creator.name },
      });
    })
    .catch((err) => {
      next(err);
    });
  // Create post in db
};

exports.getSinglePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        throwError('Post not found', 404);
      }
      res.status(200).json({ post: post });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updatePost = (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwError('Validation failed', 422);
  }
  const { title, content, image } = req.body;
  if (!image && !req.file) {
    throwError('No image', 422);
  }
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        throwError('Could not find post', 404);
      }
      console.log(
        post.creator.toString(),
        req.userId,
        post.creator.toString() === req.userId,
      );
      //TODO FIX IMG URL
      if (post.creator.toString() !== req.userId) {
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
      return post
        .save()
        .then((result) => res.status(200).json({ post: result }));
    })
    .catch((err) => {
      next(err);
    });
};

exports.deletePost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        throwError('Could not find post', 404);
      }
      if (post.creator.toString() !== req.userId) {
        throwError('Not auth', 403);
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(post._id);
    })
    .then((result) => {
      return User.findById(req.userId);
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((delDoc) => {
      res.status(200).json({ message: 'Deleted post' });
    })
    .catch((err) => next(err));
};

const clearImage = (filePath) => {
  if (!filePath) return;
  filePath = path.join(__dirname, '..', filePath.replace('\\', '/'));
  fs.unlink(filePath, (err) => console.error(err));
};
