const { Router } = require('express')
const { isAuth, isAdmin } = require('../middleware/authentication')
const {
  postOrder,
  getAllOrders,
  getUserOrders,
  setOrderDelivery,
  deleteOrder,
  updateOrder,
  icomeStatsAdmin,
} = require('../Controllers/order')
const router = Router()

router.get('/', isAdmin, getAllOrders) // add isAuth and isAdmin
router.get('/income', isAdmin, icomeStatsAdmin) // add isAuth
router.put('/update/:id', isAuth, updateOrder) // add isAuth
router.get('/user/:userId', isAuth, getUserOrders) // add isAuth
router.post('/create', isAuth, postOrder) // add isAuth
router.put('/:id/delivery', isAdmin, setOrderDelivery) // add isAuth
router.delete('/delete/:id', isAuth, deleteOrder) // add isAuth

module.exports = router
