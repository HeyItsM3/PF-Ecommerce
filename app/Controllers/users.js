const UserModel = require('../Models/users')
const { hashSync, compare } = require('bcrypt')
const { access } = require('../utils/utils')

// GET ALL USERS

const getAllUsers = async (req, res) => {
  try {
    const user = await UserModel.find()
    res.status(200).json({ message: 'Request exitosa', user })
  } catch (err) {
    console.log(err)
  }
}

// REGISTER USER

const registerUser = async (req, res) => {
  const { name, password, email, phoneNumber } = req.body

  // Verify if the email already exists
  const verifyUser = await UserModel.findOne({ email })
  if (verifyUser)
    return res.status(400).json({ msg: 'The email already exists.' })

  // Check all the fields before create
  if (name && email && password) {
    const newUser = new UserModel({
      name,
      phoneNumber,
      email,
      password: hashSync(password, 10),
    })
    try {
      const user = await newUser.save()
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
        token: access(user),
      })
    } catch (error) {
      res
        .status(500)
        .json({ msg: 'Error trying to create a new user: ' + error })
    }
  } else {
    res.status(400).json('You need to provide all the information')
  }
}

// LOGIN USER

const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    // Find user email
    const user = await UserModel.findOne({
      email,
    })
    // Check if the password is right
    if (user && (await compare(password, user.password))) {
      const { password, ...rest } = user._doc
      res.status(200).json({
        rest,
        token: access(user),
      })
    } else {
      res.status(401).send({ msg: 'Invalid email or password' })
    }
  } catch (err) {
    res.status(500).json({ msg: 'Error in login user: ' + err })
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
      res.status(200).send({ msg: 'Your user has been updated', changeUser })
    } else {
      res.status(404).send({ msg: 'We cant find the user' })
    }
  } catch (err) {
    res.status(500).json({ msg: 'Error in disableUser: ' + err })
  }
}

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
}
