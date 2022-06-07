const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {
  const token = req.header('Authorization') || req.header('authorization')
  if (!token)
    return res.status(400).json({ msg: 'You need to provide a token' })

  jwt.verify(token, process.env.JWT_SEC_KEY, (err, user) => {
    if (err) return res.status(400).json({ msg: 'Invalid token' })
    req.data = user
    next()
  })
}

const isAdmin = (req, res, next) => {
  isAuth(req, res, () => {
    const { user } = req.data
    if (user && user.isAdmin === true) {
      return next()
    } else {
      res.status(400).json({ msg: 'You must be an admin' })
    }
  })
}

const isRegistered = (req, res, next) => {
  isAuth(req, res, () => {
    const { user } = req.data
    if ((user && user.role === 'registered') || user.isAdmin === true) {
      return next()
    } else {
      res.status(400).json({ msg: 'You must be Registered to do that' })
    }
  })
}

module.exports = { isAuth, isAdmin, isRegistered }
