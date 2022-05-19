const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {
  const token = req.header('Authorization') || req.header('authorization')
  if (!token)
    return res.status(400).json({ msg: 'You need to provide a token' })

  jwt.verify(token, process.env.JWT_SEC_KEY, (err, user) => {
    if (err) return res.status(400).json({ msg: 'Invalid token' })
    // const { password, ...rest } = user
    req.data = user // New request width user information
    next()
  })
}

const isAdmin = (req, res, next) => {
  isAuth(req, res, () => {
    const { user } = req.data
    if (user && user.role === 'admin') {
      return next()
    } else {
      res.status(400).json({ msg: 'You must be an admin' })
    }
  })
}

const isSeller = (req, res, next) => {
  isAuth(req, res, () => {
    const { user } = req.data
    if ((user && user.role === 'seller') || user.role === 'admin') {
      return next()
    } else {
      res.status(400).json({ msg: 'You must be a seller to do that' })
    }
  })
}

const isOwner = (req, res, next) => {
  const { owner } = req.business
  isAuth(req, res, () => {
    const { user } = req.data
    const isOwner = owner.id === user._id
    if (!isOwner) {
      return res.status(403).json({
        error: 'User is not authorized',
      })
    }
    next()
  })
}

module.exports = { isAuth, isAdmin, isSeller, isOwner }
