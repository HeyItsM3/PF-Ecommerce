const { Router } = require('express')
const { validateCreateProduct } = require('../validators/products')
const multer = require('multer')
const storage = multer.memoryStorage()
const configMulter = multer({ storage }).single('image')

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
router.post('/post', configMulter, validateCreateProduct, postProduct)
router.delete('/delete/:id', deleteProduct)
router.put('/update/:id', upDateProduct)

// // Single examina el campo (form, etc) por donde ingresa la imagen pueder ser array para multiples img
// // En este caso ingresa por el input de tipo image

module.exports = router
