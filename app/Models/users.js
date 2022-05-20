const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
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
    role: {
      type: String,
      default: 'visitant',
      enum: ['visitant', 'seller', 'admin'],
    },
    isDeleted: {
      type: Boolean,
      required: false,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    versionKey: false,
  },
  {
    timestamps: true,
  }
)

module.exports = model('Users', userSchema)
