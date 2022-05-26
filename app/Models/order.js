const { Schema, model, default: mongoose } = require('mongoose')

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
    orderProducts: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
    },
    deliveryAddress: {
      type: Schema.Types.ObjectId,
      ref: 'Address',
    },
    orderStatus: {
      type: String,
      default: 'pending',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    versionKey: false,
  },
  {
    timestamps: true,
  }
)

module.exports = model('Orders', orderSchema)
