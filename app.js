// Node_Env almacena el entorno actual del proyecto // por defecto es undefined
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const jwt = require('jsonwebtoken')
// const { sendRegisterEmail } = require('./app/utils/utils')
const passport = require('passport')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
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
app.use(helmet())
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
app.use(session({ secret: 'cats', resave: false, saveUninitialized: true }))
require('./config/passport')(app)

// GOOGLE
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
    failureRedirect: '/',
    successRedirect: '/',
    session: false,
  }),
  (req, res) => {
    const payload = {
      id: req.user.id,
    }

    console.log(req.user.id)

    jwt.sign(
      payload,
      process.env.JWT_SEC_KEY,
      { expiresIn: '5d' },
      (err, token) => {
        if (err) {
          console.log('error', err)
        }
        console.log('HOLAAA' + token)
        const jwt = token

        const htmlWithEmbeddedJWT = `
        <html>
          <script>
            // Save JWT to localStorage
            window.localStorage.setItem('authorization', '${jwt}');
            // Redirect browser to root of application
            window.open('http://localhost:3000/', '_self')
          </script>
        </html>
        `

        res.send(htmlWithEmbeddedJWT)
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
