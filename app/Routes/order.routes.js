const { Router } = require('express')
const { isAuth, isAdmin } = require('../middleware/authentication')
const {
  postOrder,
  getAllOrders,
  getUserOrders,
  getOrderDetail,
  setOrderDelivery,
  deleteOrder,
  setPaymentOrder,
} = require('../Controllers/order')
const router = Router()

router.get('/', isAuth, isAdmin, getAllOrders)
router.get('/user', isAuth, getUserOrders)
router.get('/:id', isAuth, getOrderDetail)
router.post('/create', isAuth, postOrder)
router.put('/:id/pay', isAuth, setPaymentOrder)
router.put('/:id/delivery', isAuth, setOrderDelivery)
router.delete('/delete/:id', isAuth, deleteOrder)

module.exports = router
