const express = require('express');

const app = express();

// First challenge
// app.use((req, res, next) => {
//   console.log('First middleware reached');
//   next();
// });
// app.use((req, res, next) => {
//   console.log('Second middleware reached');
// });

// Second Challenge
app.use('/users', (req, res, next) => {
  console.log('Users endpoint reached');
  res.send('<h1>No users yet, try again at another time</h1>');
});

app.use('/', (req, res, next) => {
  console.log('Index endpoint reached');
  res.send('<h1>You might want to see <a href="/users">users</a></h1>');
});

app.listen(3000);
