const { Schema, model } = require('mongoose')

const AddressSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
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
})

const Address = model('Address', AddressSchema)
module.exports = Address
