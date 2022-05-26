const KEY = process.env.STRIPE_KEY
const stripe = require('stripe')(KEY)

const paymentStripe = (req, res, next) => {
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
        res.status(200).json(stripeRes)
      }
    }
  )
}

module.exports = paymentStripe
