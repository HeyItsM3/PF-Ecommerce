if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const jwt = require('jsonwebtoken')
const passport = require('passport')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const mongoSanitize = require('express-mongo-sanitize')
const PORT = process.env.PORT || 3001
const { dbConnect } = require('./config/mongo')
const router = require('./app/Routes')
const {
  middlewareError,
  handleError,
} = require('./app/middleware/Error/Errors')
const { limiter } = require('./app/utils/utils')

//* MIDDLEWARE
app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({ limit: '50bm', extended: true }))
app.use(morgan('dev'))
app.use(
  helmet({
    contentSecurityPolicy: false,
    frameguard: true,
  })
)
app.use(
  mongoSanitize({
    allowDots: true,
  })
)
app.use(
  cors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  })
)

dbConnect()
require('./config/passport')(app)

// GOOGLE

router.get('/login/success', (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: 'successfull',
      user: req.user,
      //   cookies: req.cookies
    })
  }
})

router.get('/login/failed', (req, res) => {
  res.status(401).json({
    success: false,
    message: 'failure',
  })
})

app.get(
  '/google',
  passport.authenticate('google', {
    session: false,
    scope: ['profile', 'email'],
    accessType: 'offline',
    approvalPrompt: 'force',
  })
)

app.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login/failed',
    session: false,
  }),
  (req, res) => {
    const payload = {
      id: req.user.id,
    }

    jwt.sign(
      payload,
      process.env.JWT_SEC_KEY,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) {
          console.log('error', err)
        }
        res.cookie('token', token)
        res.redirect(307, process.env.CLIENT_URL)
      }
    )
  }
)

//* ROUTES
app.use('/api', router)
app.use(middlewareError)
app.use(handleError)

//* CONNECTION

app.listen(PORT, () => {
  console.log(`El servidor corre correctamente en el puerto ${PORT}`)
})
