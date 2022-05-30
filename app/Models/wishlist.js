const { Schema, model } = require('mongoose')

const wishlistModel = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'Users',
  },
  product: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Products',
    },
  ],
})

module.exports = model('Wishlist', wishlistModel)
