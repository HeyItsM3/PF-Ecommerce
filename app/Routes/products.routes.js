const { Router } = require('express')
const { validateCreateProduct } = require('../validators/products')
const { isAuth } = require('../Middleware/authentication')
const { configMulter } = require('../utils/utils')
const {
  getAllProducts,
  getProductDetail,
  postProduct,
  updateProduct,
  deleteProduct,
  postProductReview,
} = require('../Controllers/products')
const router = Router()

router.get('/', getAllProducts)
router.get('/detail/:id', getProductDetail)
router.post('/post', configMulter, validateCreateProduct, postProduct) // add isRegistered
router.delete('/delete/:id', deleteProduct) // add isRegistered
router.put('/update/:id', updateProduct) // add isRegistered
router.post('/:id/reviews', isAuth, postProductReview) // add isRegistered

module.exports = router
