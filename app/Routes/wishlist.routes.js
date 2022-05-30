const { Router } = require('express')
const {
  insertToWishlist,
  findWishlist,
  getAllWishlist,
  deleteFromWishlist,
} = require('../Controllers/wishlist')
const { isAuth, isAdmin } = require('../Middleware/authentication.js')
const router = Router()

router.post('/add/:productId', isAuth, insertToWishlist)
router.get('/user/', isAuth, findWishlist)
router.delete('/delete/:productId', isAuth, deleteFromWishlist)
router.get('/all', isAdmin, getAllWishlist)

module.exports = router
