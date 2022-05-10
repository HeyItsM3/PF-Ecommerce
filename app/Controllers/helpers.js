const jwt = require('jsonwebtoken')

const access = (user) =>
  jwt.sign(
    {
      id: user._id, // Mongo guarda en _doc nuestros documentos
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SEC_KEY,
    { expiresIn: '5d' }
  )

module.exports = { access }
