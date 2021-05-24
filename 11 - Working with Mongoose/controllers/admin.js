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
  const product = new Product({
    title,
    price,
    description,
    imageUrl,
    userId: req.user._id,
  });
  product
    .save()
    .then((result) => {
      // console.log(result);
      console.log('Created Product');
      res.redirect('/admin/products');
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.updateOne({ _id: prodId }, { title, price, description, imageUrl })
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
  Product.findById(prodId)
    .then((products) => {
      const product = products;
      if (!product) return res.redirect('/');
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
      });
    })
    .catch((err) => console.error(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => console.error(err));
};

exports.postDeleteProduct = (req, res, next) => {
  const pId = req.body.productId;
  Product.findByIdAndRemove({ _id: pId })
    .then((result) => {
      console.log('ITEM DELETED');
      res.redirect('/admin/products');
    })
    .catch((err) => console.error(err));
};
