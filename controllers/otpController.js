const Registration = require('../models/Registration')

// 4-digit OTP generate karo
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString()
}

// POST /api/send-otp
// Body: { phone }
const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required',
      })
    }

    const registration = await Registration.findOne({ phone })

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'No registration found with this phone number',
      })
    }

    // OTP generate karo
    const otp = generateOTP()
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000) // 5 min valid

    registration.otp = otp
    registration.otpExpiry = otpExpiry
    await registration.save()

    // Terminal me print karo (mock SMS)
    console.log('\n=================================')
    console.log(`📱 OTP for ${phone}: ${otp}`)
    console.log(`⏰ Valid till: ${otpExpiry.toLocaleTimeString()}`)
    console.log('=================================\n')

    res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// POST /api/verify-otp
// Body: { phone, otp }
const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body

    if (!phone || !otp) {
      return res.status(400).json({
        success: false,
        message: 'Phone and OTP are required',
      })
    }

    const registration = await Registration.findOne({ phone })

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'No registration found',
      })
    }

    if (!registration.otp || !registration.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'Please request an OTP first',
      })
    }

    // Expiry check
    if (new Date() > registration.otpExpiry) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      })
    }

    // OTP match check
    if (registration.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      })
    }

    // Success
    registration.isVerified = true
    registration.otp = null
    registration.otpExpiry = null
    await registration.save()

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        name: registration.name,
        phone: registration.phone,
        isVerified: registration.isVerified,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

module.exports = { sendOTP, verifyOTP }