const BusinessModel = require('../Models/business')
const { streamUpload } = require('../utils/utils')

// POST A NEW BUSINESS

const createBusiness = async (req, res, next) => {
  const { name } = req.body
  const verifyBusiness = await BusinessModel.findOne({ name })
  // Check if the name of the business is not repeated
  if (verifyBusiness) {
    return res
      .status(400)
      .json({ msg: 'This business name is already in use.' })
  }
  try {
    const { url } = await streamUpload(req) // Upload a business image
    const newBusiness = { name, image: url }
    const business = await BusinessModel.create(newBusiness)
    business.owner = req.data.user

    business.save()
      ? res.status(200).json({ business, msg: 'Business successfully created' })
      : res.status(401).json({ msg: 'Error product not found or is not valid' })
  } catch (err) {
    return res
      .status(401)
      .json({ msg: `Error trying to create a business, ${err.message}` })
  }
}

// SEARCH THE BUSINESS ID FOR THE DETAIL

const foundBusinessId = (req, res, next, id) => {
  BusinessModel.findById(id)
    .populate('owner', '_id name')
    .exec((error, business) => {
      if (!business || error)
        return res.status(400).json({ msg: 'Business not found' })
      req.business = business
      next()
    })
}

// GET THE BUSINESS DETAIL

const getBusinessDetail = (req, res) => {
  if (req.business) {
    return res.status(200).json(req.business)
  } else {
    return res.status(404).json({ msg: 'We cant find the business' })
  }
}

// CHANGE THE STATE OF THE BUSINESS TO isDeleted

const deleteBusiness = async (req, res, next) => {
  const { isDeleted } = req.body
  const business = req.business

  if (business) {
    business.isDeleted = isDeleted

    const deletedBusiness = await business.save()
    res
      .status(200)
      .json({ msg: 'Business successfully deleted', deletedBusiness })
  } else {
    res.status(404).send({ msg: 'We cant find the business' })
  }
}

const getAllBusinesses = async (req, res, next) => {
  try {
    const businesses = await BusinessModel.find()
    businesses
      ? res
          .status(200)
          .json({ msg: 'Businesses successfully obtained', businesses })
      : next(new Error('Error Apparently there are no users '))
  } catch (err) {
    next(new Error('Error trying to get all businesses'))
  }
}

module.exports = {
  createBusiness,
  getBusinessDetail,
  deleteBusiness,
  foundBusinessId,
  getAllBusinesses,
}
