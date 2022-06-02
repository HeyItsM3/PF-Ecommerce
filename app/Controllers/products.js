const { streamUpload } = require('../utils/utils')
const ProductModel = require('../Models/products')
const _ = require('lodash')

// GET Products
const getAllProducts = async (req, res, next) => {
  const {
    query: { name, order },
  } = req

  const queryNew = req.query.new
  const queryCategory = req.query.category
  let products

  try {
    if (name) {
      const regex = new RegExp(_.escapeRegExp(name), 'i')
      products = await ProductModel.find({
        name: { $regex: regex },
        isDeleted: false,
      })
      products
        ? res.status(200).json({ message: `Successful request`, products })
        : next(
            new Error(
              `Error Request, the product with the name:${name} was not found `
            )
          )
    }
    // order by price
    else if (order) {
      const products = await ProductModel.find().sort({
        price: req.query.order,
      })
      return res.json(products)
    }
    if (queryNew) {
      products = await ProductModel.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .limit(1)
    } else if (queryCategory) {
      products = await ProductModel.find({
        categories: {
          $in: [queryCategory],
        },
      })
    } else {
      products = await ProductModel.find({ isDeleted: false })
    }
    return res.status(200).json({ message: 'Successful request', products })
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
    next(new Error('Failed getProductDetail product controller' + err))
  }
}

// POST

const postProduct = async (req, res, next) => {
  const {
    body: {
      name,
      description,
      price,
      amountInStock,
      condition,
      model,
      screenSize,
      internalMemory,
      categories,
      brand,
    },
  } = req

  try {
    if (!req.files[0]) {
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
      amountInStock,
      categories,
      condition,
      model,
      screenSize,
      internalMemory,
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
    next(new Error('Failed deleteProduct controller' + err))
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
      ? res.status(200).json({
          msg: `The product with id: ${id} was successfully updated`,
          product,
        })
      : next(
          new Error(
            `Unable to update the product please check if the id is correct`
          )
        )
  } catch (err) {
    next(new Error('Failed upDateProduct controller' + err))
  }
}

// REVIEW

const postProductReview = async (req, res, next) => {
  const { rating, comment } = req.body

  const id = req.params.id

  const product = await ProductModel.findById(id)
  if (!product) return res.status(400).json('Product not found with that id ')

  try {
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.name === req.data.user.name
      )

      if (alreadyReviewed) {
        return res.status(400).json('Yo already post a review')
      }

      const review = {
        name: req.data.user.name,
        rating: Number(rating),
        comment,
        user: req.data.user._id,
      }

      product.reviews.push(review)

      product.numReviews = product.reviews.length

      product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length

      await product.save()
      res.status(201).json({ msg: 'Review added' })
    } else {
      res.status(404).json({ msg: 'Product not found' })
    }
  } catch (err) {
    next(new Error('Failed postProductReview controller' + err))
  }
}

module.exports = {
  getAllProducts,
  getProductDetail,
  postProduct,
  deleteProduct,
  updateProduct,
  postProductReview,
}
