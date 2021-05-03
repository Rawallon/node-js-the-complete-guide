const path = require('path');
const rootDir = require('./util/path');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootDir, 'views', '404.html'));
});

app.listen(3000);

/*
// Getting form data
app.use('/add-product', (req, res, next) => {
  res.send(
    `<form action="/product" method="POST"> 
      <input type="text" name="title" /> 
      <button type="submit">Add!</button> 
      </form>`,
  );
});
app.post('/product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/add-product');
});

//Routing
// Order of function matters!
// To make it an exact match use .get instead of .use
app.use('/', (req, res, next) => {
  console.log('This will always run!');
  next();
});
app.use('/test', (req, res, next) => {
  console.log('Test page');
  res.send('<h1>Test page</h1>');
});

// MiddleWares
app.use('/', (req, res, next) => {
  console.log('In the middleware!');
  next();
  // "Next" allows the request to continue to the next middleware
});

app.use('/', (req, res, next) => {
  console.log('And another one');
  // "setHeader" Can be used to overwrite express's
  res.send('<h1>Hello!</h1>');
});
*/
