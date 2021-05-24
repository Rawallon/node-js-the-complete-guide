const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

const _colName = 'users';

class User {
  constructor(id, username, email, cart) {
    this._id = id;
    this.email = email;
    this.username = email;
    this.cart = cart;
  }
  addToCart(product) {
    let cartProductIndex;
    let newCartItems = [];
    if (this.cart.items !== undefined) {
      cartProductIndex = this.cart.items.findIndex((cp) => {
        return cp.productId.toString() === product._id.toString();
      });
      newCartItems = [...this.cart.items];
    }
    if (cartProductIndex >= 0) {
      newCartItems[cartProductIndex].quantity += 1;
    } else {
      newCartItems.push({
        productId: new mongodb.ObjectID(product._id),
        quantity: 1,
      });
    }
    const updatedCart = {
      items: newCartItems,
    };
    const db = getDB();
    return db
      .collection(_colName)
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: updatedCart } },
      );
  }

  getCart() {
    const db = getDB();
    const productIds = this.cart.items.map((p) => p.productId);
    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) =>
        products.map((p) => {
          return {
            ...p,
            quantity: this.cart.items.find(
              (q) => q.productId + '' === p._id + '',
            ).quantity,
          };
        }),
      );
  }

  deleteItemFromCart(pId) {
    const updatedCart = this.cart.items.filter(
      (p) => p.productId.toString() !== pId.toString(),
    );
    const db = getDB();
    return db
      .collection(_colName)
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: { items: updatedCart } } },
      );
  }

  addOrder() {
    const db = getDB();
    return this.getCart()
      .then((items) => {
        const order = {
          items,
          user: {
            _id: new mongodb.ObjectID(this._id),
            name: this.username,
          },
        };
        return db.collection('orders').insertOne(order);
      })
      .then((res) => {
        this.cart = { items: [] };
        return db
          .collection(_colName)
          .updateOne(
            { _id: new mongodb.ObjectID(this._id) },
            { $set: { cart: { items: [] } } },
          );
      });
  }

  getOrders() {
    const db = getDB();
    return db
      .collection('orders')
      .find({ 'user._id': new mongodb.ObjectID(this._id) })
      .toArray();
    // .findOne({ 'user._id': new mongodb.ObjectID(this._id) });
  }

  save() {
    const db = getDB();
    return db
      .collection(_colName)
      .insertOne(this)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }

  static findById(uId) {
    const db = getDB();
    return db.collection(_colName).findOne({ _id: new mongodb.ObjectID(uId) });
  }
}

module.exports = User;
