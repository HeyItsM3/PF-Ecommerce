const { streamUpload } = require('../utils/utils')
const ProductModel = require('../Models/products')
const _ = require('lodash')

// GET Products
const getAllProducts = async (req, res, next) => {
  const {
    query: { name, order },
  } = req

  const qNew = req.query.new
  const qCategory = req.query.category
  let products

  try {
    if (name) {
      const regex = new RegExp(_.escapeRegExp(name), 'i')
      products = await ProductModel.find({ name: { $regex: regex } })
      products
        ? res.status(200).json({ message: `Successful request`, products })
        : next(
            new Error(
              `Error Request, the product with the name:${name} was not found `
            )
          )
    }

    // filter by brand
    // else if (filter) {
    //   const products = await ProductModel.find({
    //     brand: req.query.filter,
    //   })
    //   return res.json(products)
    // }
    // order by price
    else if (order) {
      const products = await ProductModel.find().sort({
        price: req.query.order,
      })
      return res.json(products)
    }
    if (qNew) {
      products = await ProductModel.find().sort({ createdAt: -1 }).limit(1)
    } else if (qCategory) {
      products = await ProductModel.find({
        categories: {
          $in: [qCategory],
        },
      })
    } else {
      products = await ProductModel.find()
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
    next(new Error('Filed getProductDetail product controller' + err))
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
      brand,
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
    const categoriesArr = req.body.categories.map((categories) => categories)

    const newProduct = {
      name,
      brand,
      description,
      price,
      amountInStock,
      categories: categoriesArr,
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

// REVIEW

const postProductReview = async (req, res, next) => {
  const { rating, comment } = req.body

  const product = await ProductModel.findById(req.params.id)

  try {
    if (product) {
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.data.user._id.toString()
      )

      if (alreadyReviewed) {
        next(new Error('Yo already post a review'))
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
    next(new Error('Filed postProductReview controller' + err))
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
