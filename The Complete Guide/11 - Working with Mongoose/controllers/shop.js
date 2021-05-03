const Order = require('../models/order');
const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  Product.find()
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
  Product.find()
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
  Product.findById(pId)
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
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: user.cart.items,
      });
    })
    .catch((err) => console.error(err));
};

exports.postCart = (req, res, next) => {
  const pId = req.body.productId;
  Product.findById(pId)
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
  console.log('postOrder');
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((p) => {
        return { quantity: p.quantity, product: { ...p.productId._doc } };
      });
      const order = new Order({
        products,
        user: {
          name: req.user.name,
          userId: req.user._id,
        },
      });
      req.user.clearCart();
      return order.save();
    })
    .then(() => {
      res.redirect('/orders');
    });
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      console.log(orders.products);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders,
      });
    })
    .catch((err) => console.error(err));
};
