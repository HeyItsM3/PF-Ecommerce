// Node_Env almacena el entorno actual del proyecto // por defecto es undefined
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const PORT = process.env.PORT || 4000
const { dbConnect } = require('./config/mongo')
const router = require('./app/Routes')

//* MIDDLEWARE
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(express.urlencoded({ limit: '50bm', extended: true }))
app.use(
  cors((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    )
    res.header(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, DELETE'
    )
    next()
  })
)

//* ROUTES
app.use('/api', router)

//* MULTER

//* CONNECTION
dbConnect()
app.listen(PORT, () => {
  console.log(`El servidor corre correctamente en el puerto ${PORT}`)
})
