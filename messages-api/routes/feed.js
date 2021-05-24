const express = require('express');
const { body } = require('express-validator/check');

const feedController = require('../controllers/feed');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - imageUrl
 *         - content
 *         - creator
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         title:
 *           type: string
 *           description: The post title
 *         imageUrl:
 *           type: string
 *           description: Image of post
 *         content:
 *           type: string
 *           description: content of post
 *         creator:
 *           type: string
 *           description: User creator of post
 *       example:
 *         id: 60abe5cc11fb7b17b873095f
 *         title: The New Turing Omnibus
 *         imageUrl: images\oos21csz0-80.png
 *         content: Test
 *         creator: 60896f97ead3712ae4e5f7ec
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Posts
 */

/**
 * @swagger
 * /feed/posts:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fetched sucessfully
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.get('/posts', isAuth, feedController.getPosts);

/**
 * @swagger
 * /feed/post:
 *   post:
 *     summary: Creates a post
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Fetched sucessfully
 */
router.post(
  '/post',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.createPost,
);

/**
 * @swagger
 * /feed/post/{id}:
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Fetched sucessfully
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 */
router.get('/post/:postId', isAuth, feedController.getPost);

/**
 * @swagger
 * /feed/post/{id}:
 *   put:
 *     summary: Updates a post
 *     tags: [Posts]
 *     security:
 *      - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *         type: string
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Post'
 *     responses:
 *       200:
 *         description: Fetched sucessfully
 */
router.put(
  '/post/:postId',
  isAuth,
  [
    body('title').trim().isLength({ min: 5 }),
    body('content').trim().isLength({ min: 5 }),
  ],
  feedController.updatePost,
);

router.delete('/post/:postId', isAuth, feedController.deletePost);

module.exports = router;
