const KEY = process.env.STRIPE_KEY
const stripe = require('stripe')(KEY)
const OrderModel = require('../Models/order')

// PAY ORDER

const paymentStripe = async (req, res, next) => {
  const order = await OrderModel.findById(req.params.id)
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
