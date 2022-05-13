const { Schema, model } = require('mongoose')

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  email: {
    type: String,
    required: [true, 'email is required'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'password is required'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'phoneNumber is required'],
  },
  isSeller: {
    type: Boolean,
    default: false,
    required: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: false,
  },
})

module.exports = model('Users', userSchema)
