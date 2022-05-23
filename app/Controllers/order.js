const OrderModel = require('../Models/order')
// const UserModel = require('../Models/users')
// const ProductModel = require('../Models/products')

// GET ORDERS

const getAllOrders = async (req, res) => {
  const orders = await OrderModel.find().populate('user', 'name')
  res.status(200).json(orders)
}

// POST A NEW ORDER

const postOrder = async (req, res) => {
  const {
    orderProducts,
    deliveryAddress,
    paymentMethod,
    productsCost,
    shippingCost,
    totalCost,
  } = req.body
  if (orderProducts.length === 0) {
    return res.status(400).json({ msg: 'You need to add orderProducts' })
  } else {
    const order = new OrderModel({
      orderProducts,
      deliveryAddress,
      paymentMethod,
      productsCost,
      shippingCost,
      totalCost,
      user: req.data.user._id,
    })
    const newOrder = await order.save()

    res.status(201).json({ msg: 'Order created successfully', newOrder })
  }
}

// GET ORDER DETAIL (BY ORDER ID)

const getOrderDetail = async (req, res) => {
  const order = await OrderModel.findById(req.params.id)
  if (order) {
    res.status(200).json(order)
  } else {
    res.status(404).json({ message: 'Order Not Found' })
  }
}

// SET DELIVERY ORDER

const setOrderDelivery = async (req, res) => {
  const order = await OrderModel.findById(req.params.id)
  if (order) {
    order.isDelivered = true
    order.deliveredAt = Date.now()
    await order.save()
    res.status(200).json({ message: 'Order Delivered' })
  } else {
    res.status(404).json({ message: 'Order Not Found' })
  }
}

// DELETE ORDER

const deleteOrder = async (req, res) => {
  const order = await OrderModel.findById(req.params.id)
  if (order) {
    await order.remove()
    res.status(200).json({ message: 'Order Deleted' })
  } else {
    res.status(404).json({ message: 'Order Not Found' })
  }
}

// GET ORDERS BY USER ID

const getUserOrders = async (req, res) => {
  const userOrder = await OrderModel.find({ user: req.data.user._id })
  res.status(200).json(userOrder)
}

// PAY ORDER

const setPaymentOrder = async (req, res) => {
  const order = await OrderModel.findById(req.params.id)

  if (order) {
    order.paidAt = Date.now()
    order.isPaid = true
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.email_address,
    }

    const paidOrder = await order.save()

    return res.status(200).json(paidOrder)
  } else {
    return res.status(404).json({ message: 'Order Not Found' })
  }
}

module.exports = {
  getAllOrders,
  postOrder,
  getUserOrders,
  getOrderDetail,
  setOrderDelivery,
  setPaymentOrder,
  deleteOrder,
}
