const { Router } = require('express')
const router = Router()
const users = require('./users.routes')
const products = require('./products.routes')
const business = require('./business.routes')
const order = require('./order.routes')

router.use('/users', users)
router.use('/products', products)
router.use('/business', business)
router.use('/order', order)

module.exports = router
