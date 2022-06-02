const KEY = process.env.STRIPE_KEY
const stripe = require('stripe')(KEY)
const OrderModel = require('../Models/order')
const productModel = require('../Models/products');
const { sendPaymentEmail } = require('../utils/utils')
const user = require('../Models/users')
const mongoose = require('mongoose');

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
          order.orderProducts.map(async (p) => 
            {
              const product = await productModel.findById(p.product)
              const update = {amountInStock : product.amountInStock - p.quantity}
              const filter = { _id : mongoose.Types.ObjectId(p.product)}
              const productUpdated = await productModel.findOneAndUpdate(filter, update, {new : true})
              console.log(productUpdated);
            }
          )
          sendPaymentEmail(user.name, user.email);
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
