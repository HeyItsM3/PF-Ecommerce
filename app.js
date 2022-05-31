// Node_Env almacena el entorno actual del proyecto // por defecto es undefined
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const flash = require('express-flash')
const session = require('express-session')
const passport = require('passport')
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const mongoSanitize = require('express-mongo-sanitize')
const PORT = process.env.PORT || 4000
const { dbConnect } = require('./config/mongo')
const router = require('./app/Routes')
const {
  middlewareError,
  handleError,
} = require('./app/middleware/Error/Errors')
const { limiter } = require('./app/utils/utils')
require("./config/passport");
// require("./config/googleConfig");

//* MIDDLEWARE
app.use(limiter)
app.use(express.json())
app.use(express.urlencoded({ limit: '50bm', extended: true }))
app.use(
  session({
    secret: 'secr3t',
    resave: false,
    saveUninitialized: true,
  })
)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
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

app.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email'],
  })
)

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/",
    failureFlash: true,
    successFlash: "Iniciaste sesión correctamente con tu cuenta de Google",
  })
)

//* ROUTES
app.use('/api', router)
app.use(middlewareError)
app.use(handleError)

//* CONNECTION
dbConnect()
app.listen(PORT, () => {
  console.log(`El servidor corre correctamente en el puerto ${PORT}`)
})
