const { Router } = require('express')
const { getAllUsers, registerUser, loginUser } = require('../Controllers/users')
const router = Router()

router.get('/', getAllUsers)
router.post('/login', loginUser)
router.post('/register', registerUser)

router.delete('/')
router.put('/')

module.exports = router
