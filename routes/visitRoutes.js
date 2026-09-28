const express = require('express')
const router = express.Router()
const {
  markVisit,
  getAllVisits,
  getVisitStats,
  getLeaderboard,
} = require('../controllers/visitController')

// POST /api/mark-visit — stall visit record karne ke liye
router.post('/mark-visit', markVisit)

// GET /api/visits — saare visits dekhne ke liye
router.get('/visits', getAllVisits)

// GET /api/visits/stats — stall-wise count dekhne ke liye
router.get('/visits/stats', getVisitStats)

// GET /api/leaderboard — attendee-wise visit count dekhne ke liye
router.get('/leaderboard', getLeaderboard)



module.exports = router