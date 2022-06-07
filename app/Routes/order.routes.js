const { Router } = require('express')
const { isAuth, isAdmin } = require('../middleware/authentication')
const {
  postOrder,
  getAllOrders,
  getUserOrders,
  getOrderDetail,
  setOrderDelivery,
  deleteOrder,
} = require('../Controllers/order')
const router = Router()

router.get('/', isAuth, isAdmin, getAllOrders)
router.get('/user', isAuth, getUserOrders)
router.post('/create', isAuth, postOrder)
router.get('/:id', isAuth, getOrderDetail)
router.put('/send/:id', setOrderDelivery)
router.delete('/delete/:id', isAuth, deleteOrder)

module.exports = router
