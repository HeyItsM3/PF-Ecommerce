const { Router } = require('express')
const router = Router()
const users = require('./users.routes')
const products = require('./products.routes')
const order = require('./order.routes')
const stripe = require('./stripe.routes')
const wishlist = require('./wishlist.routes')

router.use('/users', users)
router.use('/products', products)
router.use('/orders', order)
router.use('/checkout', stripe)
router.use('/wishlist', wishlist)

module.exports = router
