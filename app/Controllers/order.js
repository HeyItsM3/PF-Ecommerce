const OrderModel = require('../Models/order')
const { sendShippedEmail } = require('../utils/utils')

// GET ORDERS

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find().populate('user', 'name')
    res.status(200).json(orders)
  } catch (err) {
    next(new Error('Failed getAllOrders product controller' + err))
  }
}

// POST A NEW ORDER

const postOrder = async (req, res, next) => {
  const {
    orderProducts,
    deliveryAddress,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body
  if (!req.body)
    return res.status(404).json({ msg: 'You need to provide all the data' })
  if (orderProducts && orderProducts.length === 0) {
    return res.status(400).json({ msg: 'You need to add orderProducts' })
  } else {
    try {
      const order = new OrderModel({
        orderProducts,
        deliveryAddress,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: req.data.user._id,
      })
      const newOrder = await order.save()

      res.status(201).json({ msg: 'Order created successfully', newOrder })
    } catch (err) {
      next(new Error('Error in postOrder' + err))
    }
  }
}

// GET ORDER DETAIL (BY ORDER ID)
// TO SEE THE DETAIL IN PANEL OF ALL ORDERS

const getOrderDetail = async (req, res) => {
  const order = await OrderModel.findById(req.params.id)
  if (order) {
    res.status(200).json(order)
  } else {
    res.status(404).json({ message: 'Order Not Found' })
  }
}

// SET DELIVERY ORDER

const setOrderDelivery = async (req, res, next) => {
  if (!req.params.id) next(new Error('You need to provide an id'))
  const order = await OrderModel.findById(req.params.id).populate({
    path: 'user',
    select: 'name email',
  })
  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    await order.save()
    sendShippedEmail(order.user.name, order.user.email)
    res.status(200).json({ message: 'Order Delivered' })
  } else {
    next(new Error('Order Not Found'))
  }
}

// DELETE ORDER

const deleteOrder = async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id)
  if (order) {
    await order.remove()
    res.status(200).json({ message: 'Order Deleted' })
  } else {
    next(new Error('Order Not Found'))
  }
}

// GET ORDERS BY USER ID

const getUserOrders = async (req, res, next) => {
  try {
    const userOrder = await OrderModel.find({ user: req.data.user._id })
    res.status(200).json({ msg: 'Succesfull request', userOrder })
  } catch (err) {
    next(new Error('User Order Not Found' + err))
  }
}

module.exports = {
  getAllOrders,
  postOrder,
  getUserOrders,
  getOrderDetail,
  setOrderDelivery,
  deleteOrder,
}
