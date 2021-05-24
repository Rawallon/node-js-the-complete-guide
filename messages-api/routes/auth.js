const express = require('express');
const { body } = require('express-validator/check');

const User = require('../models/user');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Status:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           description: The auto-generated id of the post
 *       example:
 *         status: Hello there, this is a status!
 */
/**
 * @swagger
 * components:
 *  securitySchemes:
 *    bearerAuth:            # arbitrary name for the security scheme
 *      type: http
 *      scheme: bearer
 *      bearerFormat: JWT    # optional, arbitrary value for documentation purposes
 */
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User login and register
 */

/**
 * @swagger
 * tags:
 *   name: Status
 *   description: User status message
 */

/**
 * @swagger
 * /auth/signup:
 *  put:
 *    summary: Registers an user
 *    tags: [Auth]
 *    responses:
 *      '201':
 *        description: User created
 *      '422':
 *        description: Validation failed
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *             - email
 *             - name
 *             - password
 *            properties:
 *              email:
 *                type: string
 *              name:
 *                type: string
 *              password:
 *                type: string
 *          example:
 *            email: "rawallon@gmail.com"
 *            name: "rawallon"
 *            password: "123123123"
 */
router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 5 }),
    body('name').trim().not().isEmpty(),
  ],
  authController.signup,
);

/**
 * @swagger
 * /auth/login:
 *  post:
 *    summary: authenticates an user
 *    tags: [Auth]
 *    responses:
 *      '200':
 *        description: A successful response
 *      '401':
 *        description: Wrong email/password
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *             - email
 *             - password
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *          example:
 *            email: "rawallon@gmail.com"
 *            password: "123123123"
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/status:
 *  get:
 *    security:
 *     - bearerAuth: []
 *    summary: gets user status
 *    tags: [Status]
 *    responses:
 *      '200':
 *        description: Status updated
 */
router.get('/status', isAuth, authController.getUserStatus);

/**
 * @swagger
 * /auth/status:
 *  patch:
 *    security:
 *     - bearerAuth: []
 *    summary: updates user status
 *    tags: [Status]
 *    responses:
 *      '200':
 *        description: Status updated
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            required:
 *             - status
 *            properties:
 *              status:
 *                type: string
 *          example:
 *            status: "Hello there, I'm new here!"
 */
router.patch(
  '/status',
  isAuth,
  [body('status').trim().not().isEmpty()],
  authController.updateUserStatus,
);

module.exports = router;
