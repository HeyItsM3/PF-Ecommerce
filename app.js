// Node_Env almacena el entorno actual del proyecto // por defecto es undefined
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const PORT = process.env.PORT || 4000
const { dbConnect } = require('./config/mongo')
const router = require('./app/Routes')
const {
  middlewareError,
  handleError,
} = require('./app/Error/middleware/Errors')
//* MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(helmet())
app.use(express.urlencoded({ limit: '50bm', extended: true }))

//* ROUTES
app.use('/api', router)
app.use(middlewareError)
app.use(handleError)

//* CONNECTION
dbConnect()
app.listen(PORT, () => {
  console.log(`El servidor corre correctamente en el puerto ${PORT}`)
})
