const { validationResult } = require('express-validator');
const User = require('../models/user');
const { throwError } = require('./errorHandler');

exports.getStatus = (req, res, next) => {
  User.findById(req.userId).then((userDoc) => {
    if (!userDoc) {
      throwError('No user found', 404);
    }
    res.status(200).json({ status: userDoc.status });
  });
};

exports.putStatus = (req, res, next) => {
  User.findById(req.userId)
    .then((userDoc) => {
      if (!userDoc) {
        throwError('No user found', 404);
      }
      userDoc.status = req.body.status;
      return userDoc.save();
    })
    .then((result) => {
      res.status(200).json({ status: result.status });
    })
    .catch((err) => next(err));
};
