require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const morgan = require('morgan')
const PORT = process.env.PORT || 4000
const { dbConnect } = require('./config/mongo')
const router = require('./app/Routes/index')
//* MIDDLEWARE
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({ limit: '50bm', extended: true }))

//* ROUTES
app.use('/api', router)

//* CONNECTION
dbConnect()
app.listen(PORT, () => {
  console.log(`El servidor corre correctamente en el puerto ${PORT}`)
})
