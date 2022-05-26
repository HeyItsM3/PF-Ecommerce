const { Schema, model, default: mongoose } = require('mongoose')

const cartSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: [true, 'User are required'],
    },
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
  },
  {
    versionKey: false,
  },
  {
    timestamps: true,
  }
)

module.exports = model('Cart', cartSchema)
