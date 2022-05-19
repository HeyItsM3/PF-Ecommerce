const { Schema, model, default: mongoose } = require('mongoose')

const OrderSchema = new Schema(
  {
    products: {
      type: Schema.Types.ObjectId,
      ref: 'Cart',
    },
    clientName: {
      type: String,
      trim: true,
      required: 'Name is required',
    },
    clientEmail: {
      type: String,
      trim: true,
      required: 'Email is required',
    },
    deliveryAddress: {
      country: { type: String, required: [true, 'Country is required'] },
      province: { type: String, required: [true, 'Province is required'] },
      city: { type: String, required: [true, 'City is required'] },
      zipcode: { type: String, required: [true, 'Zip Code is required'] },
      street: { type: String, required: [true, 'Street is required'] },
    },
    user: { type: mongoose.Schema.ObjectId, ref: 'User' },
    payment_id: {},
  },
  {
    versionKey: false,
  }
)

module.exports = model('Order', OrderSchema)
