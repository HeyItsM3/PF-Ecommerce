const UserModel = require('../Models/users')
const { hashSync, compare } = require('bcrypt')
const { access } = require('../utils/utils')

const getAllUsers = async (req, res) => {
  try {
    const user = await UserModel.find()
    res.status(200).json({ message: 'Request exitosa', user })
  } catch (err) {
    console.log(err)
  }
}

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

const loginUser = async (req, res, next) => {
  const { email, password } = req.body
  try {
    // Find user email
    const user = await UserModel.findOne({
      email,
    })
    // Check if the password is right
    if (user && (await compare(password, user.password))) {
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        isAdmin: user.isAdmin,
        token: access(user),
      })
    } else {
      res.status(401).send({ message: 'Invalid email or password' })
    }
  } catch (err) {
    res.status(500).json({ msg: 'Error in login user: ' + err })
  }
}

module.exports = { getAllUsers, registerUser, loginUser }
