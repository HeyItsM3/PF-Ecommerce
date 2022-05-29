const { Router } = require('express')
const { insertToWishlist, findWishlist } = require('../Controllers/wishlist')
const { isAuth } = require('../middleware/authentication.js')
const router = Router()

router.get('/add', isAuth, insertToWishlist)
router.get('/user', isAuth, findWishlist)

module.exports = router
