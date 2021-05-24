const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const { throwError } = require('./errorHandler');

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throwError('Validation failed', 422);
  }
  const { email, name, password } = req.body;
  try {
    const hashedPw = await bcrypt.hash(password, 12);

    const user = new User({
      email: email,
      password: hashedPw,
      name: name,
      status: 'Hey there!',
    });
    const result = await user.save();

    res.status(201).json({ userId: result._id });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  try {
    const userDoc = await User.findOne({ email: email });
    if (!userDoc) {
      throwError('User not found', 401);
    }
    loadedUser = userDoc;
    const isEqual = await bcrypt.compare(password, userDoc.password);

    if (!isEqual) {
      throwError('Wrong pw', 401);
    }
    const token = jwt.sign(
      { email: loadedUser.email, userId: loadedUser._id.toString() },
      'secret',
      { expiresIn: '1000h' },
    );
    res.status(200).json({ token: token, userId: loadedUser._id });
  } catch (error) {
    next(error);
  }
};
