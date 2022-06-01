const { Schema, model } = require('mongoose')

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name is required'],
    },
    typeEmail: {
      type: String,
      required: true,
      default: 'email'
    },
    email: {
      type: String,
      required: () => {
        return this.typeEmail === 'email';
      }
    },
    googleId: {
      type: String
    },
    password: {
      type: String,
      required: () => {
        return this.typeEmail === 'email';
      }
    },
    phoneNumber: {
      type: String,
      required: () => {
        return this.typeEmail === 'email';
      }
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
    source: {
      type: String,
      default: 'manual',
      required: [true, 'source not specified'],
    },
  },
  {
    versionKey: false,
  },
  {
    timestamps: true,
  },
)

module.exports = model('Users', userSchema)
