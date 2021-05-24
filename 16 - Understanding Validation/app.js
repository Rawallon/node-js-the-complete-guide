const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
const csurf = require('csurf');
const flash = require('connect-flash');

const errorController = require('./controllers/error');
const User = require('./models/user');

const MONGODB_URI = 'mongodb://localhost:27017/shop';

const app = express();
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collections: 'sessions',
});

const csurfProtec = csurf();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(
  session({
    secret: 'secretveryhushhush',
    resave: false,
    saveUninitialized: false,
    store: store,
  }),
);
app.use(csurfProtec);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) return next();
  User.findOne({ _id: req.session.user._id })
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.error(err));
});

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.CSRFToken = req.csrfToken();
  next();
});
app.use('/admin', adminRoutes);
app.use(authRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI + '?poolSize=20&writeConcern=majority')
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
