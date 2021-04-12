const mongodb = require('mongodb');
const getDB = require('../util/database').getDB;

const _colName = 'products';

class Product {
  constructor(title, price, description, imageUrl, userId) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.description = description;
    this.userId = userId;
  }

  save(pId) {
    const db = getDB();
    var dbOp;
    if (pId) {
      dbOp = db
        .collection(_colName)
        .replaceOne({ _id: new mongodb.ObjectID(pId) }, this, {
          upsert: false,
        });
    } else {
      dbOp = db.collection(_colName).insertOne(this);
    }

    return dbOp
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }

  static fetchAll() {
    const db = getDB();
    return db
      .collection(_colName)
      .find()
      .toArray()
      .then((products) => products)
      .catch((err) => console.error(err));
  }

  static findByID(pId) {
    const db = getDB();
    return db
      .collection(_colName)
      .find({ _id: new mongodb.ObjectID(pId) })
      .next()
      .then((product) => product)
      .catch((err) => console.error(err));
  }

  static deleteByID(pId) {
    const db = getDB();
    return db
      .collection(_colName)
      .deleteOne({ _id: new mongodb.ObjectID(pId) })
      .then((product) => product)
      .catch((err) => console.error(err));
  }
}

module.exports = Product;
