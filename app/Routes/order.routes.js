const { Router } = require('express')
// const { validateOrderProduct } = require('../validators/order')
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

router.get('/', isAuth, isAdmin, getAllOrders) // add isAuth and isAdmin
router.get('/user', isAuth, getUserOrders) // add isAuth
router.post('/create', isAuth, postOrder) // add isAuth
router.get('/:id', isAuth, getOrderDetail) // add isAuth
router.put('/send/:id', isAdmin, setOrderDelivery) // add isAuth
router.delete('/delete/:id', isAuth, deleteOrder) // add isAuth

module.exports = router
