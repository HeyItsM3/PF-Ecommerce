const { Router } = require('express')
const {
  getAllUsers,
  registerUser,
  loginUser,
  updateUser,
} = require('../Controllers/users')
const router = Router()

router.get('/', getAllUsers)
router.post('/login', loginUser)
router.post('/register', registerUser)
router.put('/update/:id', updateUser)

module.exports = router
