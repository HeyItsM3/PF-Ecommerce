const { Router } = require('express')
const {
  getAllUsers,
  updateUserByAdmin,
  updateUserProfile,
  getUserById,
  userStats,
} = require('../Controllers/users')
const { registerUser, loginUser } = require('../Controllers/auth')
const { isAuth, isAdmin } = require('../middleware/authentication.js')
const router = Router()

router.get('/', isAdmin, getAllUsers)
router.get('/:id', isAuth, getUserById)
router.get('/stats', isAdmin, userStats)
router.post('/login', loginUser)
router.post('/register', registerUser)
router.put('/profile/', isAuth, updateUserProfile)
router.put('/update/:id', isAuth, isAdmin, updateUserByAdmin)

module.exports = router
