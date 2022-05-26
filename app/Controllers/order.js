const OrderModel = require('../Models/order')
// const UserModel = require('../Models/users')
// const ProductModel = require('../Models/products')

// GET ORDERS

const getAllOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find()
    res.status(200).json({ msg: 'Succesfull request', orders })
  } catch (err) {
    next(new Error('Error in getAllOrders' + err))
  }
}

// POST A NEW ORDER

const postOrder = async (req, res, next) => {
  const { orderStatus, deliveryAddress, amount, orderProducts } = req.body
  if (orderProducts && orderProducts.length === 0) {
    return res.status(400).json({ msg: 'You need to add orderProducts' })
  } else {
    try {
      const order = new OrderModel({
        orderStatus,
        orderProducts,
        deliveryAddress,
        amount,
        user: req.data.user._id,
      })
      const newOrder = await order.save()

      res
        .status(201)
        .json({ msg: 'Order created successfully', order: newOrder })
    } catch (err) {
      next(new Error('Error in postOrder' + err))
    }
  }
}

// SET DELIVERY ORDER

const setOrderDelivery = async (req, res, next) => {
  if (!req.params.id) next(new Error('You need to provide an id'))
  const order = await OrderModel.findById(req.params.id)
  if (order) {
    order.orderStatus = 'Delivered'
    order.deliveredAt = Date.now()
    const delivered = await order.save()
    res.status(200).json({ message: 'Order Delivered', delivered })
  } else {
    next(new Error('Order Not Found'))
  }
}

// DELETE ORDER

const deleteOrder = async (req, res, next) => {
  if (!req.params.id) next(new Error('You need to provide an id'))
  const order = await OrderModel.findById(req.params.id)
  if (order) {
    order.isDeleted = true
    const deletedOrder = await order.save()
    res.status(200).json({ message: 'Order Deleted', deletedOrder })
  } else {
    next(new Error('Order Not Found'))
  }
}

// GET ORDERS BY USER ID

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await OrderModel.find({ user: req.params.userId })
    res.status(200).json({ msg: 'Succesfull request', orders })
  } catch (err) {
    next(new Error('User Order Not Found' + err))
  }
}

// GET INCOMES

const getIncomes = async (req, res, next) => {
  const productId = req.query.pid
  const date = new Date()
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1))

  try {
    const income = await OrderModel.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount',
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' },
        },
      },
    ])
    res.status(200).json({ msg: 'Succesfull request', income })
  } catch (err) {
    next(new Error('Error in getIncomes ' + err))
  }
}

module.exports = {
  getAllOrders,
  postOrder,
  getUserOrders,
  setOrderDelivery,
  deleteOrder,
  getIncomes,
}
