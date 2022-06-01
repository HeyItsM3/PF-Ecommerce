const { Router } = require('express')
const { validateCreateProduct } = require('../validators/products')
const { isAuth, isAdmin } = require('../middleware/authentication')
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
router.post('/post', isAdmin, configMulter, validateCreateProduct, postProduct)
router.delete('/delete/:id', isAdmin, deleteProduct)
router.put('/update/:id', isAdmin, updateProduct)
router.post('/:id/reviews', isAuth, postProductReview)

module.exports = router
