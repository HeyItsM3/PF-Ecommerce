const { check } = require('express-validator')
const validateResults = require('../middleware/handleValidator')
const validateCreateProduct = [
  check('name').exists().notEmpty().isLength({ min: 5, max: 123 }),
  check('brand').exists().notEmpty(),
  check('description').exists().notEmpty(),
  check('price').isNumeric().exists().notEmpty(),
  check('amountInStock').isNumeric().exists().notEmpty(),
  check('condition').isString().exists().notEmpty(),
  check('model').isString().exists().notEmpty(),
  check('screenSize').exists().notEmpty(),
  check('internalMemory').exists().notEmpty(),
  // check('categories').exists().notEmpty(),
  check('image').exists(),
  (req, res, next) => validateResults(req, res, next),
]

module.exports = { validateCreateProduct }
