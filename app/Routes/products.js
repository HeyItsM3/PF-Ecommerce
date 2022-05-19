const { Router } = require('express')
const { validateCreateProduct } = require('../validators/products')
const {
  getAllProducts,
  getProductDetail,
  postProduct,
  upDateProduct,
  deleteProduct,
  configMulter,
} = require('../Controllers/products')
const router = Router()

router.get('/', getAllProducts)
router.get('/detail/:id', getProductDetail)
router.post('/post', configMulter, validateCreateProduct, postProduct)
router.delete('/delete/:id', deleteProduct)
router.put('/update/:id', upDateProduct)

module.exports = router
