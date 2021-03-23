const fs = require('fs');
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(rootDir, 'data', 'cart.json');

module.exports = class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(p, (err, fcontent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fcontent);
      }

      const existingProductIndex = cart.products.findIndex((p) => p.id === id);
      const existingProduct = cart.products[existingProductIndex];
      let updtProduct;
      if (existingProduct) {
        updtProduct = { ...existingProduct };
        updtProduct.qty++;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updtProduct;
      } else {
        updtProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updtProduct];
      }
      cart.totalPrice += +productPrice;
      fs.writeFile(p, JSON.stringify(cart), (err) => console.log(err));
    });
  }

  static deleteProduct(id, productPrice) {
    fs.readFile(p, (err, fcontent) => {
      if (err) return;
      const updatedCart = { ...JSON.parse(fcontent) };
      const productIndex = updatedCart.products.find((p) => p.id === id);
      if (!productIndex) return;
      updatedCart.products = updatedCart.products.filter((p) => p.id !== id);
      updatedCart.totalPrice -= productPrice * productIndex.qty;
      fs.writeFile(p, JSON.stringify(updatedCart), (err) => console.log(err));
    });
  }

  static getCart(cb) {
    fs.readFile(p, (err, fcontent) => {
      if (err) cb(null);
      else cb(JSON.parse(fcontent));
    });
  }
};
