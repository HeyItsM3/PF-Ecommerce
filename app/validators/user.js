const { check } = require('express-validator')
const validateResults = require('../Middleware/handleValidator')
const validateUser = [
  check('name').exists().notEmpty().isLength({ min: 5, max: 123 }),

  (req, res, next) => validateResults(req, res, next),
]

module.exports = { validateUser }
