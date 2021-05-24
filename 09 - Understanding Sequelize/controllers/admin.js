const { deleteById } = require('../models/product');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};
exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
    .createProduct({
      title: title,
      price: price,
      imageUrl: imageUrl,
      description: description,
    })
    .then((result) => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then((prod) => {
      prod.title = title;
      prod.imageUrl = imageUrl;
      prod.price = price;
      prod.description = description;
      return prod.save();
    })
    .then((result) => {
      console.log('UPDATED PRODUCT');
      res.redirect('/admin/products');
    })
    .catch((err) => console.error(err));
};
exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) return res.redirect('/');

  const prodId = req.params.productId;
  req.user
    .getProducts({ where: { id: prodId } })
    // Product.findByPk(prodId)
    .then((products) => {
      const product = products[0];
      if (!product) return res.redirect('/');
      res
        .render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: editMode,
          product,
        })
        .catch((err) => console.error(err));
    });
};

exports.getProducts = (req, res, next) => {
  req.user
    .getProducts()
    // Product.findAll()
    .then((products) => {
      res
        .render('admin/products', {
          prods: products,
          pageTitle: 'Admin Products',
          path: '/admin/products',
        })
        .catch((err) => console.error(err));
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findByPk(prodId)
    .then((prod) => {
      return prod.destroy();
    })
    .then((result) => {
      console.log('ITEM DELETED');
      res.redirect('/admin/products');
    })
    .catch((err) => console.error(err));
};
