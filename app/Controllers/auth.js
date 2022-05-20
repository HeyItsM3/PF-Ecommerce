const UserModel = require('../Models/users')
const { hashSync, compare } = require('bcrypt')
// const nodemailer = require ('nodemailer')
const { sendRegisterEmail } = require ('../nodemailer/nodemailer')
const { createToken } = require('../utils/utils')

// REGISTER USER

const registerUser = async (req, res, next) => {
  const { name, password, email, phoneNumber, role } = req.body
  // Verify if the email already exists
  const verifyUser = await UserModel.findOne({ email })
  verifyUser && next(new Error('The email already exists.'))

  // Check all the fields before create
  if (name && email && password) {
    const newUser = new UserModel({
      name,
      phoneNumber,
      email,
      role,
      password: hashSync(password, 10),
    })
    try {
      const user = await newUser.save()
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        token: createToken(user),
      })
      sendRegisterEmail(
        user.name,
        user.email);
    } catch (error) {
      next(new Error('Error trying to create a new user'))
    }
  } else {
    next(new Error('You need to provide all the information'))
  }
}

// LOGIN USER

const loginUser = async (req, res, next) => {
  const { email, password } = req.body
  try {
    // Find user email
    const user = await UserModel.findOne({
      email,
    })
    // Check if the password is right
    if (user && (await compare(password, user.password))) {
      console.log(user)
      const { password, ...rest } = user._doc
      const token = createToken(user)
      res.status(200).json({
        rest,
        token,
      })
    } else {
      next(new Error('Invalid email or password'))
    }
  } catch (err) {
    next(new Error('Error in login user'))
  }
}

module.exports = {
  registerUser,
  loginUser,
}
