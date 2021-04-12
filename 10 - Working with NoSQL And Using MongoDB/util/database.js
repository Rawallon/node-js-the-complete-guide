const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
// _ is a naming covention
// to signfy this var is used only in this file
let _db;

const mongoConnect = (cb) => {
  MongoClient.connect(
    'mongodb://localhost:27017/shop?poolSize=20&writeConcern=majority',
  )
    .then((res) => {
      console.log('Connected to Mongo');
      _db = res.db();
      cb();
    })
    .catch((err) => {
      throw err;
      console.error(err);
    });
};

const getDB = () => {
  if (_db) {
    return _db;
  }
  throw 'No DB Found!';
};

exports.mongoConnect = mongoConnect;
exports.getDB = getDB;
