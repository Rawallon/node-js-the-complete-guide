const path = require('path');
const express = require('express');
const rootDir = require('../util/path');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('shop');
  //res.send('<h1>Hello!</h1>');
  res.sendFile(path.join(rootDir, 'views', 'shop.html'));
});

module.exports = router;
