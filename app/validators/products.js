const { check } = require('express-validator')
const validateResults = require('../middleware/handleValidator')
const validateCreateProduct = [
  check('name').exists().notEmpty().isLength({ min: 5, max: 123 }),
  check('brand').exists().notEmpty(),
  check('description').exists().notEmpty(),
  check('price').isNumeric().exists().notEmpty(),
  check('amount').isNumeric().exists().notEmpty(),
  check('condition').isString().exists().notEmpty(),
  check('model').isString().exists().notEmpty(),
  check('offer').isBoolean().exists().notEmpty(),
  check('dimensions').exists().notEmpty(),
  check('category').isString().exists().notEmpty(),
  check('other').isString().exists().notEmpty(),

  (req, res, next) => validateResults(req, res, next),
]

module.exports = { validateCreateProduct }
// .custom((file, { req }) => file === req.body.file)
