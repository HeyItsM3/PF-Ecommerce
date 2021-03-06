require('dotenv').config()
const rateLimit = require('express-rate-limit')
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
    streamifier.createReadStream(req).pipe(stream)
  })
}

// JWT CONFIGURATION

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

// SEND EMAIL CONFIGURATION

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.API_KEY_SENDGRID,
    },
  })
)

// REGISTER EMAIL

const sendRegisterEmail = (name, email) => {
  transporter.sendMail({
    to: email,
    from: 'ecommerce.grupo07@gmail.com',
    subject: 'Bienvenido a StoreCel! ',
    html: `<h1>Email Confirmation</h1>
    <h2>Hello ${name}</h2>
    <p>Your registration has been successfully completed</p>`,
  })
}

// PAYMENT EMAIL

const sendPaymentEmail = (name, email) => {
  console.log('sendPaymentEmail success')
  transporter
    .sendMail({
      to: email,
      from: 'ecommerce.grupo07@gmail.com',
      subject: 'Gracias por su compra!',
      html: `<h1>Esperamos que la disfrutes!</h1>
        <h2> ${name}</h2>
        <p>Hasta la proxima!</p>
        </div>`,
    })
    .catch((err) => console.log(err))
}

// SHIPPED EMAIL

const sendShippedEmail = (name, email) => {
  console.log('sendShippedEmail success')
  transporter
    .sendMail({
      to: email,
      from: 'ecommerce.grupo07@gmail.com',
      subject: 'Tu compra ha sido enviada exitosamente!',
      html: `<h1>Esperamos que la disfrutes!</h1>
        <h2> ${name}</h2>
        <p>Hasta la proxima!</p>
        </div>`,
    })
    .catch((err) => console.log(err))
}

// RATE-LIMITING CONFIGURATION

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

module.exports = {
  limiter,
  sendRegisterEmail,
  sendPaymentEmail,
  sendShippedEmail,
  cloudinary,
  streamUpload,
  createToken,
  configMulter,
}
