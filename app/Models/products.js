const { Schema, model } = require('mongoose')

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
  image: {
    type: String,
  },
  public_id: {
    type: String,
  },
})

module.exports = model('Products', productSchema)
