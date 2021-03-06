const UserModel = require('../Models/users')
const { hashSync, genSalt } = require('bcrypt')
const { createToken } = require('../utils/utils')

// GET ALL USERS

const getAllUsers = async (req, res, next) => {
  try {
    const user = await UserModel.find({ isDeleted: false })
    user
      ? res.status(200).json({ message: 'Request exitosa', user })
      : next(new Error('Error Apparently there are no users '))
  } catch (err) {
    next(new Error('Error trying to get users'))
  }
}

// UPDATE USER BY ADMIN

const updateUserByAdmin = async (req, res, next) => {
  const {
    params: { id },
    body: { name, email, phoneNumber, isDeleted, isAdmin },
  } = req
  try {
    const user = await UserModel.findById(id)
    if (user) {
      user.name = name || user.name
      user.email = email || user.email
      user.phoneNumber = phoneNumber || user.phoneNumber
      user.isDeleted = isDeleted
      user.isAdmin = isAdmin

      const changeUser = await user.save()
      const { password, ...rest } = changeUser._doc

      res.status(200).json({ msg: 'The user has been updated', user: rest })
    } else {
      next(new Error('We cant find the user'))
    }
  } catch (err) {
    next(new Error('Error in updateUserAdminPanel'))
  }
}

// GET USER BY ID

const getUserById = async (req, res, next) => {
  const { id } = req.params
  try {
    const user = await UserModel.findById(id).select('-password')
    user
      ? res.status(200).json({ msg: 'Successful request', user, error: false })
      : next(
          new Error(`Error Request, the user with the id:${id} was not found, `)
        )
  } catch (err) {
    next(new Error('Failed getUserById controller'))
  }
}

// UPDATE USER BY USER

const updateUserProfile = async (req, res, next) => {
  const salt = await genSalt(10)
  const {
    body: { name, email, phoneNumber },
  } = req
  const { _id } = req.data.user
  try {
    const user = await UserModel.findById(_id)
    if (user) {
      user.name = name || user.name
      user.email = email || user.email
      user.phoneNumber = phoneNumber || user.phoneNumber
      if (req.body.password) {
        user.password = hashSync(req.body.password, salt)
      }

      const userUpdated = await user.save()
      const { password, isAdmin, isDeleted, ...rest } = userUpdated._doc
      const token = createToken(userUpdated)

      res.status(200).header('Authorization', token).json({
        msg: 'User profile Updated successfully',
        rest,
        token,
      })
    } else {
      next(new Error('We cant find the user'))
    }
  } catch (err) {
    next(new Error('Error in updateUserProfile'))
  }
}

const userStats = async (req, res, next) => {
  const date = new Date()
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

  try {
    const data = await UserModel.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ])
    res.status(200).json(data)
  } catch (err) {
    next(new Error('Error in userStats' + err))
  }
}

module.exports = {
  getAllUsers,
  updateUserByAdmin,
  updateUserProfile,
  getUserById,
  userStats,
}
