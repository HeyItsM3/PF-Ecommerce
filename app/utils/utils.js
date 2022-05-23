require('dotenv').config()
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const jwt = require('jsonwebtoken')
const multer = require('multer')

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
    // const data = req.files.map((x) => x.buffer)
    streamifier.createReadStream(req).pipe(stream)
  })
}

// JWT CONFIGURATION
//  id: user._id => Mongo guarda en _doc nuestros documentos

const createToken = (user) =>
  jwt.sign(
    {
      user,
    },
    process.env.JWT_SEC_KEY,
    { expiresIn: '5d' }
  )

// MULTER CONFIGURATION

const storage = multer.memoryStorage()
const maxSize = 2 * 1024 * 1024
const configMulter = multer({
  storage,
  fileFilter: (req, files, cb) => {
    if (
      files.mimetype === 'image/png' ||
      files.mimetype === 'image/jpg' ||
      files.mimetype === 'image/jpeg'
    ) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(
        new Error({
          message: 'Only .png, .jpg and .jpeg format allowed!',
          error: true,
        })
      )
    }
  },
  limits: { fileSize: maxSize },
}).array('image', 4)
// // Single examina el campo (form, etc) por donde ingresa la imagen pueder ser array para multiples img
// // En este caso ingresa por el input de tipo image

// CONSTANTES

const defaultImg =
  'https://res.cloudinary.com/pf-ecommerce/image/upload/v1652945191/Default%20PF/blank-profile-picture-973460_960_720_qp13gh.png'

module.exports = {
  cloudinary,
  streamUpload,
  createToken,
  configMulter,
  defaultImg,
}
