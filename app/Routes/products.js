const { Router } = require('express')
const {
  getAllProducts,
  getProductDetail,
  postProduct,
  upDateProduct,
  deleteProduct,
} = require('../Controllers/products')
const router = Router()

router.get('/', getAllProducts)
router.get('/detail/:id', getProductDetail)
router.post('/post', postProduct)
router.delete('/delete/:id', deleteProduct)
router.put('/update/:id', upDateProduct)

module.exports = router
