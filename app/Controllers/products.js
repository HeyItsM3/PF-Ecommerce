const { findByIdAndUpdate } = require('../Models/products')
const { cloudinary } = require('../../utils/cloudinary')
const ProductModel = require('../Models/products')

// GET All Products // by name

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
    console.log(err)
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
    console.log(err)
  }
}

// POST

// const postProduct = async (req, res) => {
//   const {
//     body: { name, image },
//   } = req

//   try {
//     const newProduct = {
//       name,
//       image,
//     }

//     const product = await ProductModel.create(newProduct)
//     res.status(200).json({
//       message: 'Successful request',
//       product,
//     })
//   } catch (err) {
//     console.log(err)
//   }
// }

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

    console.log(newProduct)
    // const uploadedResponse = await cloudinary.uploader.upload(image)
    const product = await ProductModel.create(newProduct)
    console.log(product)
    product
      ? res.status(200).json({
          message: 'Successful request',
          product,
        })
      : res.status(404).json({ message: 'Error' })
  } catch (err) {
    console.log(err)
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
    console.log(err)
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
    console.log(err)
  }
}

module.exports = {
  getAllProducts,
  getProductDetail,
  postProduct,
  deleteProduct,
  upDateProduct,
}
