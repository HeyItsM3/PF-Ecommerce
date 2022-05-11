const { findByIdAndUpdate } = require('../Models/products')
const { cloudinary } = require('../utils/utils')
const ProductModel = require('../Models/products')
const streamifier = require('streamifier')
const multer = require('multer')

// GET All Products // by name

// multer.app.use(multer().single('image')) // Procesa o ve si se envia una imagen
// // Single examina el campo (form, etc) por donde ingresa la imagen pueder ser array para multiples img
// // En este caso ingresa por el input de tipo image

const storage = multer.memoryStorage()
const configMulter = multer({ storage }).single('image')

const uploadImage = async (req, res, next) => {
  if (!req.file) {
    res.satus(400).json({ msg: 'You have to upload a file' })
  }
  try {
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result)
          } else {
            reject(error)
          }
        })
        streamifier.createReadStream(req.file.buffer).pipe(stream)
      })
    }
    const result = await streamUpload(req)
    res.status(200).json(result)
  } catch (err) {
    res.status(500).json({ msg: 'Filed to upload the image:' + err })
  }
}

const getAllProducts = async (req, res) => {
  const {
    query: { name },
  } = req
  try {
    if (name) {
      const regex = new RegExp(name, 'i')
      const products = await ProductModel.find({ name: { $regex: regex } })
      products
        ? res.status(200).json({ message: `Successful request`, products })
        : res.status(404).json({
            message: `Error Request, the product with the name:${name} was not found `,
          })
    } else {
      const product = await ProductModel.find()
      res.status(200).json({ message: 'Successful request', product })
    }
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Filed getAllProducts product controller' + err })
  }
}

// GET DETAIL

const getProductDetail = async (req, res) => {
  const {
    params: { id },
  } = req
  try {
    const product = await ProductModel.findById(id)
    product
      ? res.status(200).json({ message: 'Successful request', product })
      : res.status(404).json({
          message: `Error Request, the product with the id:${id} was not found `,
        })
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Filed getProductDetail product controller' + err })
  }
}

// POST

const postProduct = async (req, res) => {
  const {
    body: {
      name,
      image,
      brand,
      description,
      price,
      amount,
      condition,
      model,
      offer,
      dimensions,
      other,
    },
  } = req

  try {
    const newProduct = {
      name,
      image,
      brand,
      description,
      price,
      amount,
      condition,
      model,
      offer,
      dimensions,
      other,
    }

    const product = await ProductModel.create(newProduct)
    product
      ? res.status(200).json({
          message: 'Successful request',
          product,
        })
      : res.status(404).json({ message: 'Error' })
  } catch (err) {
    res.status(500).json({ msg: 'Filed post product controller' + err })
  }
}

// DELETE

const deleteProduct = async (req, res) => {
  const {
    params: { id },
  } = req
  try {
    const product = await ProductModel.findByIdAndDelete(id)

    product
      ? res.status(200).json({
          message: `Successful request, the product with the id:${id} was deleted`,
        })
      : res.status(404).json({
          message: `Error Request, the product with the id:${id} was not found `,
        })
  } catch (err) {
    res.status(500).json({ msg: 'Filed deleteProduct controller' + err })
  }
}

// UPDATE

const upDateProduct = async (req, res) => {
  const {
    params: { id },
    body: { name },
  } = req
  try {
    const productUpdate = {
      name,
    }
    const product = await findByIdAndUpdate(id, productUpdate, { new: true })
    product
      ? res.status(200).json({
          message: `
    The user with id: ${id} was successfully updated`,
        })
      : res.status(404).json({
          message: `
    Unable to update the product please check if the id is correct`,
        })
  } catch (err) {
    res.status(500).json({ msg: 'Filed upDateProduct controller' + err })
  }
}

module.exports = {
  getAllProducts,
  getProductDetail,
  postProduct,
  deleteProduct,
  upDateProduct,
  uploadImage,
  configMulter,
}
