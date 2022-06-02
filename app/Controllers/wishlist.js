const WishlistModel = require('../Models/wishlist')
const ProductModel = require('../Models/products')

// POST WISHLIST

const insertToWishlist = async (req, res, next) => {
  const { productId } = req.params
  const id = req.data.user._id
  const product = await ProductModel.findById(productId)
  if (!product) return res.status(404).json({ msg: 'Product not found' })
  if (!id) return res.status(404).json({ msg: 'User not found' })
  try {
    const wishList = await WishlistModel.findOne({ user: id })

    if (wishList?.product.includes(productId)) {
      return res
        .status(400)
        .json({ msg: 'You already have this product on your wishlist' })
    }
    if (!wishList) {
      const newWishlist = new WishlistModel({
        user: id,
        product: productId,
      })
      await newWishlist.save()
    } else {
      const data = {
        product: [...wishList.product, productId],
      }
      const result = await WishlistModel.findOneAndUpdate(productId, data, {
        new: true,
      })
      if (!result) return res.status(300).json({ msg: 'Cant add to wishlist' })
    }
    return res.status(200).json({
      msg: 'New product in your wishlist',
    })
  } catch (err) {
    next(new Error('insertToWishlist failed ' + err))
  }
}

// GET USER WISHLIST

const findWishlist = async (req, res, next) => {
  try {
    const user = req.data.user._id

    const wishlist = await WishlistModel.find({ user }).populate({
      path: 'product',
      select: 'name price brand image',
    })

    res.status(200).json({
      wishlist,
    })
  } catch (err) {
    next(new Error('Error in findWishlist controller' + err))
  }
}

// GET ALL WISHLIST

const getAllWishlist = async (req, res, next) => {
  try {
    const orders = await WishlistModel.find().populate({
      path: 'product',
      select: 'name',
    })
    res.status(200).json(orders)
  } catch (err) {
    next(new Error('Error in getAllWishlist controller' + err))
  }
}

// DELETE USER WISHLIST

const deleteFromWishlist = async (req, res, next) => {
  const user = req.data.user._id
  const product = req.params.productId

  const testDeleted = await WishlistModel.findOne({ product })
  if (!testDeleted)
    return next(new Error('This product does not exist in the list'))

  const result = await WishlistModel.findOneAndUpdate(
    { user },
    { $pull: { product } },
    { new: true }
  ).populate({
    path: 'product',
    select: 'name price brand image',
  })
  if (!result) {
    res.status(400).json({ message: "Couldn't find wish list" })
  } else {
    res.status(200).json({ message: 'Deleted Succefully', result })
  }
}

module.exports = {
  insertToWishlist,
  findWishlist,
  getAllWishlist,
  deleteFromWishlist,
}
