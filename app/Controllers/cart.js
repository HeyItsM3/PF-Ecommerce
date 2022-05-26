const CartModel = require('../Models/cart')

// ALL CARTS

const getAllCarts = async (req, res, next) => {
  try {
    const carts = await CartModel.find()
    res.status(200).json({ msg: 'Succesfull request getAllCarts', carts })
  } catch (err) {
    next(new Error('Error in getAllCarts' + err))
  }
}

// USER CART

const userCart = async (req, res, next) => {
  if (!req.params.userId) next(new Error('You need to provide an id'))
  try {
    const cart = await CartModel.findOne({ user: req.params.userId })
    console.log(cart)
    res.status(200).json({ msg: 'User cart: ', cart })
  } catch (err) {
    next(new Error('Error in userCart or was not found'))
  }
}

// CREATE NEW CART

const createCart = async (req, res, next) => {
  const { items } = req.body
  if (!items && items === undefined) {
    return res.status(400).json({ msg: 'You need to add product' })
  } else {
    try {
      const newCart = new CartModel({
        items,
        user: req.data.user._id,
      })
      const saveCart = await newCart.save()
      res.status(200).json({ msg: 'Cart created', saveCart })
    } catch (err) {
      next(new Error('Error in createCart' + err))
    }
  }
}

// UPDATE CART

const updateCart = async (req, res, next) => {
  if (!req.params.id) next(new Error('You need to provide an id'))
  // const verifyCart = await CartModel.findOne({ _id: { $eq: req.params.id } })
  // !verifyCart && next(new Error('This cart does not exist anymore'))
  try {
    const updatedCart = await CartModel.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    )
    res.status(200).json({ msg: 'Cart updated successfully', updatedCart })
  } catch (err) {
    next(new Error('Error in updateCart' + err))
  }
}

// DELETE CART

const deleteCart = async (req, res, next) => {
  if (!req.params.id) next(new Error('You need to provide an id'))
  const verifyCart = await CartModel.findOne({ _id: { $eq: req.params.id } })
  !verifyCart && next(new Error('This cart does not exist anymore'))
  try {
    const deletedCart = await CartModel.findByIdAndDelete(req.params.id)
    res.status(200).json({ msg: 'Cart deleted successfully', deletedCart })
  } catch (err) {
    next(new Error('Error in deleteCart' + err))
  }
}

module.exports = {
  createCart,
  updateCart,
  deleteCart,
  userCart,
  getAllCarts,
}
