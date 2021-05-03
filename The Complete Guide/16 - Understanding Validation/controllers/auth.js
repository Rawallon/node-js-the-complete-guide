const User = require('../models/user');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator/check');

const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const user = require('../models/user');
const transporter = nodemailer.createTransport(
  sendgrid({
    auth: {
      api_key: null,
    },
  }),
);

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: false,
    errorMessage: req.flash('error'),
    validationErrors: [],
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: req.flash('error'),
    oldInput: { email: '', password: '', confirmPassword: '' },
    validationErrors: [],
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password },
      validationErrors: errors.array(),
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.render('auth/login', {
          path: '/login',
          pageTitle: 'Login',
          isAuthenticated: false,
          errorMessage: errors.array()[0].msg,
          oldInput: { email, password },
          validationErrors: errors.array(),
        });
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            req.flash('error', 'Invalid email and password');
            return res.render('auth/login', {
              path: '/login',
              pageTitle: 'Login',
              isAuthenticated: false,
              errorMessage: errors.array()[0].msg,
              oldInput: { email, password },
              validationErrors: errors.array(),
            });
          }
          req.session.isLoggedIn = true;
          req.session.user = user;
          return req.session.save((err) => {
            console.log(err);
            res.redirect('/');
          });
        })
        .catch((err) => {
          console.error(err);
        });
    })
    .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
      isAuthenticated: false,
      errorMessage: errors.array()[0].msg,
      oldInput: { email, password, confirmPassword },
      validationErrors: errors.array(),
    });
  }

  return bcrypt
    .hash(password, 12)
    .then((hashPw) => {
      const user = new User({ email, password: hashPw });
      return user.save();
    })
    .then((_) => {
      transporter.sendMail({
        to: email,
        from: 'shop@node-complete.com',
        subject: 'Thanks for signing up',
        html: '<h1>nice</h1>',
      });
      res.redirect('/login');
    })
    .catch((err) => console.error(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/');
  });
};

exports.getReset = (req, res, next) => {
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset',
    errorMessage: req.flash('error'),
  });
};

exports.postReset = (req, res, next) => {
  crypto.randomBytes(32, (err, buff) => {
    if (err) {
      return res.redirect('/reset');
    }
    const token = buff.toString('hex');
    User.findOne({ email: req.body.email })
      .then((userDoc) => {
        if (!userDoc) {
          req.flash('error', 'No account with that email');
          return res.redirect('/reset');
        }
        userDoc.resetToken = token;
        userDoc.resetTokenExpiration = Date.now() + 360000;
        userDoc.save().then((result) => {
          req.flash('error', 'The token is: ' + token);
          return res.redirect('/reset');
        });
      })

      .catch((err) => console.error(err));
  });
};

exports.getNewPW = (req, res, next) => {
  const token = req.params.token;
  console.log(token);
  User.findOne({
    resetToken: token,
    resetTokenExpiration: { $gt: Date.now() },
  })
    .then((user) => {
      res.render('auth/reset-password', {
        path: '/reset-password',
        pageTitle: 'New Password',
        errorMessage: req.flash('error'),
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      req.flash('error', 'Invalid token, try again');
      return res.redirect('/reset');
    });
};

exports.postNewPW = (req, res, next) => {
  const userId = req.body.userId;
  const newPw = req.body.password;
  const pwToken = req.body.pwToken;
  User.findOne({ _id: userId, resetToken: pwToken })
    .then((user) => {
      console.log(user);
      if (!user) {
        req.flash('error', 'User not found!');
        return res.redirect('/login');
      }

      return bcrypt
        .hash(newPw, 12)
        .then((hashPw) => {
          user.password = hashPw;
          user.resetToken = null;
          user.resetTokenExpiration = null;
          return user.save();
        })
        .then((result) => {
          req.flash('error', 'Reseted!');
          return res.redirect('/login');
        });
    })
    .catch((err) => console.error(err));
};
