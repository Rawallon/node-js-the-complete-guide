const path = require('path');

const express = require('express');
const {
  getIndex,
  getProducts,
  getProduct,
  getCart,
  getOrders,
  getCheckout,
  postCart,
  postDeleteFromCart,
} = require('../controllers/shop');

const router = express.Router();

router.get('/', getIndex);

router.get('/products', getProducts);

// Routes with param MUST be the last
router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.post('/cart', postCart);

router.post('/cart-delete-item', postDeleteFromCart);

router.get('/orders', getOrders);

router.get('/checkout', getCheckout);

module.exports = router;
