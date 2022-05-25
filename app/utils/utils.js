require('dotenv').config()
const nodemailer = require('nodemailer')
const sendgridTransport = require('nodemailer-sendgrid-transport')
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
        resolve(result.url)
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
const maxSize = 50 * 1024 * 1024
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

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.API_KEY_SENDGRID,
    },
  })
)

const sendRegisterEmail = (name, email) => {
  transporter.sendMail({
    to: email,
    from: 'ecommerce.grupo07@gmail.com',
    subject: 'Registration completed successfully!',
    html: `<h1>Email Confirmation</h1>
    <h2>Hello ${name}</h2>
    <p>Your registration has been successfully completed</p>`,
  })
}

module.exports = {
  sendRegisterEmail,
  cloudinary,
  streamUpload,
  createToken,
  configMulter,
}
