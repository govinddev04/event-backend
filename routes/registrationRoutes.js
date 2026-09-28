const express = require('express')
const router = express.Router()
const {
  registerUser,
  getAllRegistrations,
} = require('../controllers/registrationController')
const { sendOTP, verifyOTP } = require('../controllers/otpController')

// POST /api/register — naya user register karne ke liye
router.post('/register', registerUser)

// GET /api/registrations — saare users dekhne ke liye
router.get('/registrations', getAllRegistrations)

// POST /api/send-otp — OTP generate aur terminal pe print karne ke liye
router.post('/send-otp', sendOTP)

// POST /api/verify-otp — OTP verify karne ke liye
router.post('/verify-otp', verifyOTP)

module.exports = router