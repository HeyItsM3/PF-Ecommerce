const { Schema, model, default: mongoose } = require('mongoose')

const cartSchema = new Schema(
  {
    product: { type: mongoose.Schema.ObjectId, ref: 'Product' },
    business: { type: mongoose.Schema.ObjectId, ref: 'Business' },
    quantity: Number,
    status: {
      type: String,
      default: 'Pending',
      enum: ['Pending', 'Waiting Approval', 'Shipped', 'Delivered', 'Suspend'],
    },
  },
  {
    versionKey: false,
  }
)

module.exports = model('Cart', cartSchema)
