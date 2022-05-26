const { Router } = require('express')
const { isAuth, isAdmin } = require('../middleware/authentication')
const {
  createCart,
  updateCart,
  deleteCart,
  userCart,
  getAllCarts,
} = require('../Controllers/cart')
const router = Router()

router.get('/', isAdmin, getAllCarts)
router.post('/create', isAuth, createCart)
router.put('/update/:id', isAuth, updateCart)
router.delete('/delete/:id', isAuth, deleteCart)
router.get('/user/:userId', isAuth, userCart)

module.exports = router
