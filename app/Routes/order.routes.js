const { Router } = require('express')
const { isAuth, isAdmin } = require('../middleware/authentication')
const {
  postOrder,
  getOrders,
  getUserOrders,
  getOrderById,
  setOrderDelivery,
  deleteOrder,
} = require('../Controllers/order')
const router = Router()

router.get('/', isAuth, isAdmin, getOrders)
router.get('/user', isAuth, getUserOrders)
router.get('/:id', isAuth, getOrderById)
router.put('/:id/delivery', isAuth, setOrderDelivery)
router.post('/create', isAuth, postOrder)
router.delete('/delete/:id', isAuth, deleteOrder)

module.exports = router
