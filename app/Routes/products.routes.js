const { Router } = require('express')
const { validateCreateProduct } = require('../validators/products')
// const { isSeller } = require('../middleware/authentication')
const { configMulter } = require('../utils/utils')
const {
  getAllProducts,
  getProductDetail,
  postProduct,
  updateProduct,
  deleteProduct,
} = require('../Controllers/products')
const router = Router()

router.get('/', getAllProducts)
router.get('/detail/:id', getProductDetail)
router.post('/post', configMulter, validateCreateProduct, postProduct) // add isSeller
router.delete('/delete/:id', deleteProduct) // add isSeller
router.put('/update/:id', updateProduct) // add isSeller

module.exports = router
