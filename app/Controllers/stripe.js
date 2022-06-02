const KEY = process.env.STRIPE_KEY
const stripe = require('stripe')(KEY)
const OrderModel = require('../Models/order')
const productModel = require('../Models/products')
const { sendPaymentEmail } = require('../utils/utils')
const mongoose = require('mongoose')

// PAY ORDER

const paymentStripe = async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id).populate({
    path: 'user',
    select: 'name email',
  })
  console.log(order)
  stripe.charges.create(
    {
      source: req.body.tokenId,
      amount: req.body.amount,
      currency: 'usd',
    },
    (stripeErr, stripeRes) => {
      if (stripeErr) {
        next(new Error('Error in paymentStripe' + stripeErr))
      } else {
        if (order) {
          order.paidAt = Date.now()
          order.isPaid = true
          const paidOrder = order.save()
          order.orderProducts.map(async (p) => {
            const product = await productModel.findById(p.product)
            if (product.amountInStock > 0) {
              const update = {
                amountInStock: product.amountInStock - p.quantity,
              }
              const filter = { _id: mongoose.Types.ObjectId(p.product) }
              await productModel.findOneAndUpdate(filter, update, { new: true })
            } else {
              return res
                .status(400)
                .json({ msg: 'The product is out of stock' })
            }
          })
          sendPaymentEmail(order.user.name, order.user.email)
          res.status(200).json({ Stripe: stripeRes, order: paidOrder })
        } else {
          return res.status(404).json({ message: 'Order Not Found' })
        }
      }
    }
  )
}

// module.exports = paymentStripe

module.exports = paymentStripe
