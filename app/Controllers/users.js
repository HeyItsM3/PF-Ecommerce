const UserModel = require('../Models/users')

// GET ALL USERS

const getAllUsers = async (req, res) => {
  try {
    const user = await UserModel.find()
    res.status(200).json({ message: 'Successful request', user })
  } catch (err) {
    console.log(err)
  }
}

// UPDATE USER

const updateUser = async (req, res) => {
  const {
    params: { id },
    body: { name, email, phoneNumber, isSeller, isAdmin, isDeleted },
  } = req
  try {
    const user = await UserModel.findById(id)
    if (user) {
      user.name = name || user.name
      user.email = email || user.name
      user.phoneNumber = phoneNumber || user.name
      user.isSeller = isSeller || user.name
      user.isAdmin = isAdmin || user.name
      user.isDeleted = isDeleted || user.name

      const changeUser = await user.save()
      const { password, ...rest } = changeUser._doc
      res.status(200).send({ msg: 'Your user has been updated', rest })
    } else {
      res.status(404).send({ msg: 'We cant find the user' })
    }
  } catch (err) {
    res.status(500).json({ msg: 'Error in disableUser: ' + err })
  }
}

module.exports = {
  getAllUsers,
  updateUser,
}
