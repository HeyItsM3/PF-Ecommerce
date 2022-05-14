const { Router } = require('express')
const { getAllUsers, updateUser } = require('../Controllers/users')
const { registerUser, loginUser } = require('../Controllers/auth')
const router = Router()

router.get('/', getAllUsers)
router.post('/login', loginUser)
router.post('/register', registerUser)
router.put('/update/:id', updateUser)

module.exports = router
