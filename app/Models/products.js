const { Schema, model } = require('mongoose')

const productSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required'],
  },
})

module.exports = model('Products', productSchema)
