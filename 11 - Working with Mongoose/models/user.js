const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});
userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: 1,
    });
  }
  const updatedCart = {
    items: newCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.deleteItemFromCart = function (pId) {
  const updatedCart = this.cart.items.filter(
    (p) => p.productId.toString() !== pId.toString(),
  );
  this.cart = updatedCart;
  return this.save();
};
userSchema.methods.clearCart = function () {
  this.cart.items = [];
  return this.save();
};
module.exports = mongoose.model('User', userSchema);
