const { Schema, model, default: mongoose } = require('mongoose')

const orderSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'A user is required'],
      ref: 'Users',
    },
    orderProducts: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, 'Products are required'],
          ref: 'Products',
        },
        name: {
          type: String,
          required: [true, 'Product name is required'],
        },
        image: {
          type: Array,
          required: [true, 'Image is required'],
        },
        price: {
          type: Number,
          required: [true, 'Cost is required'],
        },
        quantity: {
          type: Number,
          required: [true, 'Quantity is required'],
        },
      },
    ],
    deliveryAddress: {
      fullName: {
        type: String,
        required: [true, 'FullName is required'],
      },
      address: {
        type: String,
        required: [true, 'Address is required'],
      },
      country: {
        type: String,
        required: [true, 'Country is required'],
      },
      province: {
        type: String,
        required: [true, 'Province is required'],
      },
      city: {
        type: String,
        required: [true, 'City is required'],
      },
      street: {
        type: String,
        required: [true, 'street is required'],
      },
      postalCode: {
        type: Number,
        required: [true, 'postalCode is required'],
      },
      building: { type: String },
      floor: { type: String },
      apartment: { type: String },
    },
    itemsPrice: {
      type: Number,
      required: [true, 'ItemsPrice price is required'],
    },
    shippingPrice: {
      type: Number,
      required: [true, 'Shipping cost is required'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total cost is required'],
    },
    isPaid: {
      type: Boolean,
      default: false,
      required: [true, 'Payment is required'],
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
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
