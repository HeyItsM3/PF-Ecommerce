const { Schema, model, default: mongoose } = require('mongoose')

const orderSchema = new Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: [true, 'A user is required'],
    //   ref: 'Users',
    // },
    orderProducts: [
      {
        name: { type: String, required: [true, 'Name is required'] },
        quantity: { type: Number, required: [true, 'Quantity is required'] },
        image: { type: [String], required: [true, 'Image is required'] },
        price: { type: Number, required: [true, 'Cost is required'] },
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: [true, 'Products are required'],
          ref: 'Products',
        },
      },
    ],
    deliveryAddress: {
      country: { type: String, required: [true, 'Country is required'] },
      province: { type: String, required: [true, 'Province is required'] },
      city: { type: String, required: [true, 'City is required'] },
      zipcode: { type: String, required: [true, 'Zip Code is required'] },
      street: { type: String, required: [true, 'Street is required'] },
    },
    paymentMethod: {
      type: String,
      required: [true, 'Payment method is required'],
    },
    paymentResult: {
      id: String,
      status: String,
      email_address: String,
      update_time: String,
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
    deliveredAt: {
      type: Date,
    },
    itemsPrice: {
      type: Number,
      required: [true, 'Products cost is required'],
    },
    shippingPrice: {
      type: Number,
      required: [true, 'Shipping cost is required'],
    },
    totalPrice: {
      type: Number,
      required: [true, 'Total cost is required'],
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
