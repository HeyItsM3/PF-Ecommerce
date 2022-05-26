const { Schema, model, default: mongoose } = require('mongoose')

const reviewSchema = new Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
  },
  {
    timestamps: true,
  }
)

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
    },
    description: {
      type: String,
      required: [true, 'description is required'],
    },
    price: {
      type: Number,
      required: [true, 'price is required'],
    },
    amountInStock: {
      type: Number,
      required: [true, 'amountInStock is required'],
    },
    condition: {
      type: String,
      enum: ['new', 'used'],
      required: [true, 'condition is required'],
    },
    model: {
      type: String,
      required: [true, 'model is required'],
    },
    screenSize: {
      type: mongoose.Types.Decimal128,
      required: [true, 'screenSize is required'],
    },
    internalMemory: {
      type: Number,
      required: [true, 'internalMemory is required'],
    },
    amountReviews: {
      type: Number,
      required: [true, 'amount is required'],
      default: 0,
    },
    image: {
      type: [String],
      required: [true, 'image is required'],
    },
    reviews: [reviewSchema],
    brand: {
      type: String,
      enum: [
        'ALCATEL',
        'APPLE',
        'ASUS',
        'HUAWEI',
        'LG',
        'MOTOROLA',
        'NOKIA',
        'SAMSUNG',
        'SONY',
        'XIAOMI',
      ],
      required: [true, 'category is required'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  },
  {
    timestamps: true,
  }
)

module.exports = model('Products', productSchema)
