const { check } = require('express-validator')
const validateResults = require('../middleware/handleValidator')
const validateOrderProduct = [
  check('orderProducts').exists().notEmpty(),
  check('deliveryAddress').exists().notEmpty(),
  check('paymentMethod').exists().notEmpty(),
  check('itemsPrice').exists().notEmpty(),
  check('shippingPrice').exists().notEmpty(),
  check('totalPrice').exists().notEmpty(),
  (req, res, next) => validateResults(req, res, next),
]

module.exports = { validateOrderProduct }