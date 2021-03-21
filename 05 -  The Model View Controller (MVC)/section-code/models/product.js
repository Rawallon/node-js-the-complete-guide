const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const getProductsFromFile = (cb) => {
  const file = path.join(rootDir, 'data', 'products.json');
  fs.readFile(file, (err, fcontent) => {
    let products = [];
    if (err) {
      return cb([]);
    }
    cb(JSON.parse(fcontent));
  });
};

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    getProductsFromFile((products) => {
      const file = path.join(rootDir, 'data', 'products.json');
      products.push(this);
      fs.writeFile(file, JSON.stringify(products), (err) => console.log(err));
    });
  }

  static fetchAll(cb) {
    return getProductsFromFile(cb);
  }
};
