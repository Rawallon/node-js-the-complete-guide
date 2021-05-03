const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { throwError } = require('./errorHandler');

exports.signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwError('Validation failed', 422);
  }
  const { email, name, password } = req.body;
  bcrypt
    .hash(password, 12)
    .then((hashedPw) => {
      const user = new User({
        email,
        password: hashedPw,
        name,
        status: 'Hey there!',
      });
      return user.save();
    })
    .then((result) => {
      res.status(201).json({ userId: result._id });
    })
    .catch((err) => next(err));
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (!userDoc) {
        throwError('User not found', 401);
      }
      loadedUser = userDoc;
      return bcrypt.compare(password, userDoc.password);
    })
    .then((isEqual) => {
      if (!isEqual) {
        throwError('Wrong pw', 401);
      }
      const token = jwt.sign(
        { email: loadedUser.email, userId: loadedUser._id.toString() },
        'secret',
        { expiresIn: '1000h' },
      );
      res.status(200).json({ token: token, userId: loadedUser._id });
    })
    .catch((err) => next(err));
};
