const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then((prods) => {
      res.render('shop/index', {
        prods,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.error(err));
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then((prods) => {
      res.render('shop/product-list', {
        prods,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => console.error(err));
};

exports.getProduct = (req, res, next) => {
  const pId = req.params.productId;
  Product.findByID(pId)
    .then((products) => {
      res.render('shop/product-detail', {
        pageTitle: products.title,
        product: products,
        path: '/products',
      });
    })
    .catch((err) => console.error(err));
};

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then((products) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products,
      });
    })
    .catch((err) => console.error(err));
};

exports.postCart = (req, res, next) => {
  const pId = req.body.productId;
  Product.findByID(pId)
    .then((prod) => {
      return req.user.addToCart(prod);
    })
    .then((result) => {
      res.redirect('/cart');
    });
};

exports.postDeleteFromCart = (req, res, next) => {
  const pId = req.body.productId;
  req.user.deleteItemFromCart(pId).then((result) => {
    res.redirect('/cart');
  });
};

exports.postOrder = (req, res, next) => {
  req.user
    .addOrder()
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => console.error(err));
};

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders()
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
      });
    })
    .catch((err) => console.error(err));
};
