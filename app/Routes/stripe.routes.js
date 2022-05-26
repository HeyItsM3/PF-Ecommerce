const { Router } = require('express')
const { paymentStripe } = require('../Controllers/stripe')
const { isAuth } = require('../middleware/authentication.js')
const router = Router()

router.post('/', isAuth, paymentStripe)

module.exports = router
