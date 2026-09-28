const Visit = require('../models/Visit')
const Registration = require('../models/Registration')

// POST /api/mark-visit
// Body: { phone, stallId, stallName }
const markVisit = async (req, res) => {
  try {
    const { phone, stallId, stallName } = req.body

    if (!phone || !stallId || !stallName) {
      return res.status(400).json({
        success: false,
        message: 'Phone, stallId and stallName are required',
      })
    }

    // Check karo ki ye attendee registered aur verified hai
    const registration = await Registration.findOne({ phone })

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'No registration found with this phone number',
      })
    }

    if (!registration.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Attendee is not verified yet',
      })
    }

    // Check karo ki already visit ho chuki hai kya
    const existing = await Visit.findOne({ phone, stallId })

    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Already visited ${stallName}`,
      })
    }

    // Naya visit save karo
    const visit = await Visit.create({
      phone,
      name: registration.name,
      stallId,
      stallName,
    })

    res.status(201).json({
      success: true,
      message: `Visit to ${stallName} recorded`,
      data: visit,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// GET /api/visits
const getAllVisits = async (req, res) => {
  try {
    const visits = await Visit.find().sort({ createdAt: -1 })
    res.status(200).json({
      success: true,
      count: visits.length,
      data: visits,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

// GET /api/visits/stats — stall-wise count
const getVisitStats = async (req, res) => {
  try {
    const stats = await Visit.aggregate([
      {
        $group: {
          _id: { stallId: '$stallId', stallName: '$stallName' },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ])

    const formatted = stats.map((s) => ({
      stallId: s._id.stallId,
      stallName: s._id.stallName,
      count: s.count,
    }))

    res.status(200).json({
      success: true,
      data: formatted,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}
// GET /api/leaderboard — attendee-wise visit count
const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Visit.aggregate([
      {
        $group: {
          _id: { phone: '$phone', name: '$name' },
          visitCount: { $sum: 1 },
          stalls: { $push: '$stallName' },
        },
      },
      { $sort: { visitCount: -1 } },
      { $limit: 50 },
    ])

    const formatted = leaderboard.map((entry) => {
      let badge = 'Beginner'
      if (entry.visitCount >= 9) badge = '🏆 Champion'
      else if (entry.visitCount >= 5) badge = '⭐ Enthusiast'
      else if (entry.visitCount >= 3) badge = '🎯 Explorer'

      return {
        name: entry._id.name,
        phone: entry._id.phone,
        visitCount: entry.visitCount,
        badge,
        stalls: entry.stalls,
      }
    })

    res.status(200).json({
      success: true,
      count: formatted.length,
      data: formatted,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message,
    })
  }
}

module.exports = { markVisit, getAllVisits, getVisitStats, getLeaderboard }