const { Router } = require('express')
const { validateCreateProduct } = require('../validators/products')
const multer = require('multer')
const storage = multer.memoryStorage()
const maxSize = 2 * 1024 * 1024;
const configMulter = multer({ storage,     fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
          cb(null, true);
        } else {
          cb(null, false);
          return cb(new Error({message:'Only .png, .jpg and .jpeg format allowed!', error:true}));
        }
      },
      limits: { fileSize: maxSize }}).single('image')

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
