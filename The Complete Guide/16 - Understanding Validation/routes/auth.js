const express = require('express');
const { body } = require('express-validator/check');
const user = require('../models/user');

const authController = require('../controllers/auth');

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get('/reset', authController.getReset);

router.get('/reset-password/:token', authController.getNewPW);

router.post(
  '/login',
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
      return user.findOne({ email: value }).then((userDoc) => {
        if (!userDoc) {
          return Promise.reject('Incorrect email or password 1');
        }

        return true;
      });
    })
    .normalizeEmail(),
  body(
    'password',
    'Password must be 3 characters long and must contain no special characters',
  )
    .isLength({ min: 3 })
    .isAlphanumeric()
    .custom((value, { req }) => {
      return user.findOne({ email: req.body.email }).then((userDoc) => {
        if (userDoc && userDoc.password !== value) {
          return Promise.reject('Incorrect email or password 2');
        }

        return true;
      });
    })
    .trim(),
  authController.postLogin,
);

router.post(
  '/signup',
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .custom((value, { req }) => {
      return user.findOne({ email: value }).then((userDoc) => {
        if (userDoc) {
          return Promise.reject('Email already registered');
        }
        return true;
      });
    })
    .normalizeEmail(),
  body(
    'password',
    'Password must be 3 characters long and must contain no special characters',
  )
    .isLength({ min: 3 })
    .isAlphanumeric()
    .trim(),
  body('passwordConfirmation')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }

      // Indicates the success of this synchronous custom validator
      return true;
    })
    .trim(),
  authController.postSignup,
);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post('/reset-password', authController.postNewPW);

module.exports = router;
