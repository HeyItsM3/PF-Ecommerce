const { validationResult } = require('express-validator')

const validateResults = (req, res, next) => {
  try {
    validationResult(req).throw()
    return next()
  } catch (err) {
    res.status(403)
    res.json({ erros: err.array(), error: true })
  }
}

module.exports = validateResults
