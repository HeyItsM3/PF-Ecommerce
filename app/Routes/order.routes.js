const { Router } = require('express')
const { validateOrderProduct } = require('../validators/order')
// const { isAuth, isAdmin } = require('../middleware/authentication')
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

router.get('/', getAllOrders) // add isAuth and isAdmin
router.get('/user', getUserOrders) // add isAuth
router.get('/:id', getOrderDetail) // add isAuth
router.post('/create', validateOrderProduct, postOrder) // add isAuth
router.put('/:id/pay', setPaymentOrder) // add isAuth
router.put('/:id/delivery', setOrderDelivery) // add isAuth
router.delete('/delete/:id', deleteOrder) // add isAuth

module.exports = router
