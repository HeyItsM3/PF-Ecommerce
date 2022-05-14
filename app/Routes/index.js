const { Router } = require('express')
const router = Router()
const users = require('./users.routes')
const products = require('./products.routes')

router.use('/users', users)
router.use('/products', products)

module.exports = router
