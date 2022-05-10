const mongoose = require('mongoose')
const URI_MONGO = process.env.URI_MONGO
const dbConnect = () => {
  mongoose.connect(URI_MONGO, {}, (err, res) => {
    !err
      ? console.log('**** CONNECT ****')
      : console.log('**** ERROR CONNECT ****')
  })
}

module.exports = { dbConnect }
