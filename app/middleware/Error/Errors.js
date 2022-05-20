const middlewareError = (req, res, next) => {
  const err = new Error('Not found')
  err.status = 404
  next(err)
}

const handleError = (err, req, res, next) => {
  res.status(err.status || 500)
  res.json({
    error: {
      error: true,
      status: err.status || 500,
      message: err.message,
    },
  })
}

module.exports = { middlewareError, handleError }
