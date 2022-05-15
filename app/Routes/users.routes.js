const { Router } = require('express')
const { getAllUsers, updateUser } = require('../Controllers/users')
const { registerUser, loginUser } = require('../Controllers/auth')
const { isAuth, isAdmin } = require('../middleware/authentication.js')
const router = Router()

router.get('/', isAdmin, getAllUsers)
router.post('/login', loginUser)
router.post('/register', registerUser)
router.put('/update/:id', isAuth, updateUser)

module.exports = router
