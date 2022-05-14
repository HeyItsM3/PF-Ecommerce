const { findByIdAndUpdate } = require('../Models/products')
const { streamUpload } = require('../utils/utils')
const ProductModel = require('../Models/products')

const getAllProducts = async (req, res) => {
  const {name} = req.query
  try {
    if (name) {
      const regex = new RegExp(name, 'i')
      const products = await ProductModel.find({ name: { $regex: regex } })
      products
        ? res.status(200).json({ message: `Successful request`, products })
        : res.status(404).json({
            message: `Error Request, the product with the name:${name} was not found `,
          })
    } 
     // filter by brand
     else if(req.query.filter){
      const brandProducts = await ProductModel.find({ "brand": req.query.filter } )
       return res.json(brandProducts)
  }
    //order by price
    else if(req.query.order){
      console.log(req.query.order)
      const orderByPrice = await ProductModel.find().sort({price: req.query.order})
      return res.json(orderByPrice)
  }
    else {
      const product = await ProductModel.find()
      res.status(200).json({ message: 'Successful request', product })
    }
  } catch (err) {
    res
      .status(500)
      .json({ msg: 'Failed to getAllProducts product controller' + err })
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
      .json({ msg: 'Failed to getProductDetail product controller' + err })
  }
}

// POST

const postProduct = async (req, res) => {
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
    },
  } = req

  try {
    // if (!file) {
    //   res.satus(400).json({ msg: 'You have to upload a file' })
    // }
    const { url } = await streamUpload(req)

    const newProduct = {
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
      image: url,
    }

    const product = await ProductModel.create(newProduct)
    product
      ? res.status(200).json({
          message: 'Successful request',
          product,
        })
      : res.status(404).json({ message: 'Error' })
  } catch (err) {
    res.status(500).json({ msg: 'Failed to post product controller' + err })
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
    res.status(500).json({ msg: 'Failed to deleteProduct controller' + err })
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
      ? res
          .status(200)
          .json({ msg: `The user with id: ${id} was successfully updated` })
      : res.status(404).json({
          msg: `Unable to update the product please check if the id is correct`,
        })
  } catch (err) {
    res.status(500).json({ msg: 'Failed to upDateProduct controller' + err })
  }
}

module.exports = {
  getAllProducts,
  getProductDetail,
  postProduct,
  deleteProduct,
  upDateProduct,
}
