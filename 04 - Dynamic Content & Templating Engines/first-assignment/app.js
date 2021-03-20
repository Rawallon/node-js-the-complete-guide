const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));

const usersList = [];

app.get('/users', (req, res, next) => {
  res.render('home', { usersList });
});

app.get('/', (req, res, next) => {
  res.render('form');
});

app.post('/add-user', (req, res, next) => {
  usersList.push(req.body.name);
  res.redirect('/users');
});

app.listen(3000);
