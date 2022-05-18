require('dotenv').config()
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const jwt = require('jsonwebtoken')

// CLOUDINARY CONFIGURATION

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const streamUpload = (req) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) {
        resolve(result)
      } else {
        reject(error)
      }
    })
    streamifier.createReadStream(req.files.buffer).pipe(stream)
  })
}

// JWT CONFIGURATION

const access = (user) =>
  jwt.sign(
    {
      id: user._id, // Mongo guarda en _doc nuestros documentos
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SEC_KEY,
    { expiresIn: '5d' }
  )

module.exports = { cloudinary, streamUpload, access }
