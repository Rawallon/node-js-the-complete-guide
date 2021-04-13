const User = require('../models/user');
const bcrypt = require('bcryptjs');

const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
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
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false,
    errorMessage: req.flash('error'),
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.redirect('/login');
      }

      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          if (!doMatch) {
            req.flash('error', 'Invalid email and password');
            return res.redirect('/login');
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
  // const name = req.body.name;
  const password = req.body.password;
  // const confirmPassword = req.body.confirmPassword;
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash('error', 'Email already registered');
        return res.redirect('/signup');
      }
      return bcrypt.hash(password, 12).then((hashPw) => {
        const user = new User({ email, password: hashPw });
        return user.save();
      });
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
