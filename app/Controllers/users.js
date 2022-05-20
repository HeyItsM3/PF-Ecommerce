const UserModel = require('../Models/users')

// GET ALL USERS

const getAllUsers = async (req, res, next) => {
  try {
    const user = await UserModel.find()
    user
      ? res.status(200).json({ message: 'Request exitosa', user })
      : next(new Error('Error Apparently there are no users '))
  } catch (err) {
    next(new Error('Error trying to get users'))
  }
}

// UPDATE USER

const updateUser = async (req, res, next) => {
  const {
    params: { id },
    body: { name, email, phoneNumber, isDeleted, role },
  } = req
  try {
    const user = await UserModel.findById(id)
    if (user) {
      user.name = name || user.name
      user.email = email || user.email
      user.phoneNumber = phoneNumber || user.phoneNumber
      user.role = role || user.role
      user.isDeleted = isDeleted

      const changeUser = await user.save()
      const { password, ...rest } = changeUser._doc
      res.status(200).send({ msg: 'Your user has been updated', rest })
    } else {
      next(new Error('We cant find the user'))
    }
  } catch (err) {
    next(new Error('Error in disableUser'))
  }
}

const getUserId = (req, res, next, id) => {
  UserModel.findById(id).exec((err, user) => {
    if (!user || err) {
      return res.status(400).json({ msg: 'Error trying to find user' })
    }
    req.data = user
    next()
  })
}

module.exports = {
  getAllUsers,
  updateUser,
  getUserId,
}
