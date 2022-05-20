const { Router } = require('express')
const { isAuth } = require('../middleware/authentication')
const createOrder = require('../Controllers/order')
const { getUserId } = require('../Controllers/users')
const router = Router()

router.post('/create/:userId', isAuth, createOrder)

router.param('userId', getUserId)
module.exports = router
