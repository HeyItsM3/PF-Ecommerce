const { findByIdAndUpdate } = require('../Models/products')
const { streamUpload } = require('../utils/utils')
const ProductModel = require('../Models/products')

// GET Products
const getAllProducts = async (req, res, next) => {
  const {
    query: { name, filter, order },
  } = req
  try {
    if (name) {
      const regex = new RegExp(name, 'i')
      const products = await ProductModel.find({ name: { $regex: regex } })
      products
        ? res.status(200).json({ message: `Successful request`, products })
        : next(
            new Error(
              `Error Request, the product with the name:${name} was not found `
            )
          )
    }
    // filter by brand
    else if (filter) {
      const products = await ProductModel.find({ brand: req.query.filter })
      return res.json(products)
    }
    // order by price
    else if (order) {
      const products = await ProductModel.find().sort({
        price: req.query.order,
      })
      return res.json(products)
    } else {
      const product = await ProductModel.find()
      return res.status(200).json({ message: 'Successful request', product })
    }
  } catch (err) {
    next(new Error(`Failed to getAllProducts product controller`))
  }
}

// GET DETAIL

const getProductDetail = async (req, res, next) => {
  const {
    params: { id },
  } = req
  try {
    const product = await ProductModel.findById(id)
    product
      ? res
          .status(200)
          .json({ message: 'Successful request', product, error: false })
      : next(
          new Error(
            `Error Request, the product with the id:${id} was not found, `
          )
        )
  } catch (err) {
    next(new Error('Filed getProductDetail product controller'))
  }
}

// POST

const postProduct = async (req, res, next) => {
  const {
    body: {
      name,
      brand,
      description,
      price,
      amount,
      condition,
      model,
      offer,
      dimensions,
      other,
      category,
    },
  } = req

  try {
    // if (!req.files) {
    //   return res.status(400).json({ msg: 'You have to upload an image' })
    // }
    // const { url } = await streamUpload(req.files)

    const urls = []
    const files = req.files
    for (const file of files) {
      const { buffer } = file
      const newPath = await streamUpload(buffer)
      urls.push(newPath)
    }

    const newProduct = {
      name,
      brand,
      description,
      price,
      amount,
      category,
      condition,
      model,
      offer,
      dimensions,
      other,
      image: urls.map((url) => url.res),
    }

    const product = await ProductModel.create(newProduct)
    product
      ? res.status(202).json({
          message: 'Successful request',
          product,
        })
      : res.status(400)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

// DELETE

const deleteProduct = async (req, res, next) => {
  const {
    params: { id },
  } = req
  try {
    const product = await ProductModel.findByIdAndDelete(id)

    product
      ? res.status(200).json({
          message: `Successful request, the product with the id:${id} was deleted`,
        })
      : next(
          new Error(
            `Error Request, the product with the id:${id} was not found `
          )
        )
  } catch (err) {
    next(new Error('Filed deleteProduct controller'))
  }
}
// UPDATE

const upDateProduct = async (req, res, next) => {
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
      ? res
          .status(200)
          .json({ msg: `The user with id: ${id} was successfully updated` })
      : next(
          new Error(
            `Unable to update the product please check if the id is correct`
          )
        )
  } catch (err) {
    next(new Error('Filed upDateProduct controller'))
  }
}

module.exports = {
  getAllProducts,
  getProductDetail,
  postProduct,
  deleteProduct,
  upDateProduct,
}
