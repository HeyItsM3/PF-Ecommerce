const { Schema, model, default: mongoose } = require('mongoose')

const cartSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  items: [
    {
      quantity: {
        type: Number,
        default: 1,
      },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Products are required'],
        ref: 'Products',
      },
    },
  ],
})

module.exports = model('Cart', cartSchema)
