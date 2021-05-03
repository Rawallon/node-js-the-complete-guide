const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').trim().split('=')[1];
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      req.session.user = user;
      req.session.isLoggedIn = true;
      req.session.save((err) => {
        console.error(err);
        res.redirect('/');
      });
    }
    res.status(401);
    res.redirect('/login');
  });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect('/login');
  });
};
