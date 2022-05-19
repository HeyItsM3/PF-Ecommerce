const { Router } = require('express')
const router = Router()
const users = require('./users.routes')
const products = require('./products.routes')
const business = require('./business.routes')

router.use('/users', users)
router.use('/products', products)
router.use('/business', business)

module.exports = router
