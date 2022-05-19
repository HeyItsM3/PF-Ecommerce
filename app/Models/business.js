const { Schema, model, default: mongoose } = require('mongoose')

const businessSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name is required'],
    },
    image: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.ObjectId,
      ref: 'Users',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    versionKey: false,
  }
)

module.exports = model('Business', businessSchema)
