const UserModel = require('../Models/users')
const service = require('../utils/google')

module.exports = service(UserModel)
