const fs = require('fs');
const path = require('path');

const PDFDoc = require('pdfkit');

const Product = require('../models/product');
const Order = require('../models/order');

const ITEMS_PER_PAGE = 3;

exports.getProducts = (req, res, next) => {
  const page = req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProd) => {
      totalItems = numProd;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
        totalProd: Number(totalItems),
        currentPage: Number(page),
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        hasPrev: page > 1,
        hasNext: ITEMS_PER_PAGE * page < totalItems,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const page = req.query.page || 1;
  let totalItems;

  Product.find()
    .countDocuments()
    .then((numProd) => {
      totalItems = numProd;
      return Product.find()
        .skip((page - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        totalProd: Number(totalItems),
        currentPage: Number(page),
        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE),
        hasPrev: page > 1,
        hasNext: ITEMS_PER_PAGE * page < totalItems,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getCart = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items;
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
        products: products,
      });
    })
    .catch((err) => console.log(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then((product) => {
      return req.user.addToCart(product);
    })
    .then((result) => {
      console.log(result);
      res.redirect('/cart');
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user
    .removeFromCart(prodId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res, next) => {
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          email: req.user.email,
          userId: req.user,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.getInvoice = (req, res, next) => {
  const oId = req.params.orderId;
  const fileName = 'invoice-' + oId + '.pdf';
  const invoicePath = path.join('data', 'invoice', fileName);
  const pdfDoc = new PDFDoc();

  Order.findById(oId).then((order) => {
    if (!order) {
      return next(new Error('No order with this ID'));
    }
    if (order.user.userId.toString() !== req.user._id.toString()) {
      return next(new Error('Not authorized'));
    }
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=' + fileName + '"');
    // This way it stores in memory, bad!
    // fs.readFile(invoicePath, (err, buffer) => {
    //   if (err) {
    //     return next(err);
    //   }
    //   res.send(data);
    // });
    // Better way, uses buffer
    //const file = fs.createReadStream(invoicePath);
    //file.pipe(res);

    pdfDoc.pipe(fs.createWriteStream(invoicePath));
    pdfDoc.pipe(res);
    pdfDoc.fontSize(26).text('Invoice', { underline: true });
    pdfDoc.text(' ');
    let totPrice = 0;
    order.products.forEach((prod) => {
      totPrice += prod.product.price * prod.quantity;
      pdfDoc
        .fontSize(14)
        .text(
          prod.product.title +
            ' - ' +
            prod.quantity +
            ' x ' +
            '$' +
            prod.product.price,
        );
    });
    pdfDoc.text(' ');
    pdfDoc.fontSize(16).text('Total price: $' + totPrice);
    pdfDoc.end();
  });
};
