const { Router } = require('express')
const { isAuth, isSeller, isOwner } = require('../middleware/authentication.js')
const {
  createBusiness,
  deleteBusiness,
  getBusinessDetail,
  foundBusinessId,
} = require('../Controllers/business')
const { configMulter } = require('../utils/utils')
const router = Router()

router.get('/:businessId', getBusinessDetail)
router.post('/create/:userId', isAuth, isSeller, configMulter, createBusiness)
router.put('/delete/:businessId', isAuth, isOwner, deleteBusiness)

router.param('businessId', foundBusinessId)
module.exports = router
