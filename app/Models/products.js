const { Schema, model, default: mongoose } = require('mongoose')

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  brand: {
    type: String,
    required: [true, 'brand is required'],
  },
  description: {
    type: String,
    required: [true, 'description is required'],
  },
  price: {
    type: Number,
    required: [true, 'price is required'],
  },
  amount: {
    type: Number,
    required: [true, 'amount is required'],
  },
  condition: {
    type: String,
    enum: ['good', 'disrepair', 'used'],
    required: [true, 'condition is required'],
  },
  model: {
    type: String,
    required: [true, 'model is required'],
  },
  offer: {
    type: Boolean,
    default: false,
  },
  dimensions: {
    type: mongoose.Types.Decimal128,
  },
  image: {
    type: String,
    required: [true, 'image is required'],
  },
  other: {
    type: String,
  },
})

module.exports = model('Products', productSchema)
