const Registration = require('../models/Registration')

// POST /api/register
const registerUser = async (req, res) => {
  try {
    const { name, phone } = req.body

    // Simple check: name aur phone hone chahiye
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Name and phone are required',
      })
    }

    // Check: kya ye phone number pehle se registered hai?
    const existing = await Registration.findOne({ phone })
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'This phone number is already registered',
      })
    }

    // Naya registration save karo
    const registration = await Registration.create({ name, phone })

    res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: registration,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// GET /api/registrations  (baad me admin ke liye kaam aayega)
const getAllRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

module.exports = { registerUser, getAllRegistrations }