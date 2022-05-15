const jwt = require('jsonwebtoken')

const isAuth = (req, res, next) => {
  const token = req.header('auth-token')
  if (!token)
    return res.status(400).json({ msg: 'You need to provide a token' })

  jwt.verify(token, process.env.JWT_SEC_KEY, (err, user) => {
    if (err) return res.status(400).json({ msg: 'Invalid token' })
    // const { password, ...rest } = user
    req.user = user // New request width user information
    console.log(req.user)
    next()
  })
}

const isAdmin = (req, res, next) => {
  isAuth(req, res, () => {
    if (req.user.role === 'admin') {
      return next()
    } else {
      res.status(400).json({ msg: 'You must be an admin' })
    }
  })
}

module.exports = { isAuth, isAdmin }
