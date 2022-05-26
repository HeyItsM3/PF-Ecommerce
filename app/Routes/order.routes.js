const { Router } = require('express')
// const { isAuth, isAdmin } = require('../middleware/authentication')
const {
  postOrder,
  getAllOrders,
  getUserOrders,
  setOrderDelivery,
  deleteOrder,
} = require('../Controllers/order')
const router = Router()

router.get('/', getAllOrders) // add isAuth and isAdmin
router.get('/user', getUserOrders) // add isAuth
router.post('/create', postOrder) // add isAuth
router.put('/:id/delivery', setOrderDelivery) // add isAuth
router.delete('/delete/:id', deleteOrder) // add isAuth

module.exports = router
