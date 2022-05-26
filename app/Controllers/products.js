const { streamUpload } = require('../utils/utils')
const ProductModel = require('../Models/products')
const _ = require('lodash')

// GET Products
const getAllProducts = async (req, res, next) => {
  const {
    query: { name, filter, order },
  } = req
  try {
    if (name) {
      const regex = new RegExp(_.escapeRegExp(name), 'i')
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
      const products = await ProductModel.find({
        brand: req.query.filter,
      })
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
    next(new Error(`Failed to getAllProducts product controller ` + err))
  }
}

// GET DETAIL

const getProductDetail = async (req, res, next) => {
  if (!req.params.id) next(new Error('You need to provide an id'))

  const { id } = req.params
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
    next(new Error('Filed getProductDetail product controller' + err))
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
    if (!req.files) {
      return res.status(400).json({ msg: 'You have to upload an image' })
    }

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
      image: urls,
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
  if (!req.params.id) next(new Error('You need to provide an id'))

  const { id } = req.params
  try {
    const product = await ProductModel.findById(id)
    if (product) {
      product.isDeleted = true
      await product.save()
      res.status(200).json({
        message: `Successful request, the product with the id:${id} was deleted`,
      })
    } else {
      next(
        new Error(`Error Request, the product with the id:${id} was not found `)
      )
    }
  } catch (err) {
    next(new Error('Filed deleteProduct controller' + err))
  }
}
// UPDATE

const updateProduct = async (req, res, next) => {
  if (!req.params.id) next(new Error('You need to provide an id'))

  const { id } = req.params
  try {
    const product = await ProductModel.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    )
    product
      ? res
          .status(200)
          .json({ msg: `The product with id: ${id} was successfully updated` })
      : next(
          new Error(
            `Unable to update the product please check if the id is correct`
          )
        )
  } catch (err) {
    next(new Error('Filed upDateProduct controller' + err))
  }
}

module.exports = {
  getAllProducts,
  getProductDetail,
  postProduct,
  deleteProduct,
  updateProduct,
}
