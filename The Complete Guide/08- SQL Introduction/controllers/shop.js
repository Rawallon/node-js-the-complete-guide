const Cart = require('../models/cart');
const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/product-list', {
        prods: rows,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => console.error(err));
};

exports.getProduct = (req, res, next) => {
  const pId = req.params.productId;
  Product.findById(pId)
    .then(([rows, fieldData]) => {
      res.render('shop/product-detail', {
        pageTitle: rows[0].title,
        product: rows[0],
        path: '/products',
      });
    })
    .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render('shop/index', {
        prods: rows,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.error(err));
};

exports.getCart = (req, res, next) => {
  Cart.getCart((myCart) => {
    Product.fetchAll((products) => {
      const cartProducts = [];
      for (prod of products) {
        const cartProdData = myCart.products.find((p) => p.id === prod.id);
        if (cartProdData) {
          cartProducts.push({
            productData: prod,
            qty: cartProdData.qty,
          });
        }
      }
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: cartProducts,
      });
    });
  });
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  console.log({ prodId });
  Product.findById(prodId, (product) => {
    console.log(product);
    Cart.addProduct(prodId, product.price);
  });
  res.redirect('/cart');
};

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'Your Orders',
  });
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};

exports.postDeleteFromCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId, (product) => {
    Cart.deleteProduct(prodId, product.price);
    res.redirect('/cart');
  });
};
