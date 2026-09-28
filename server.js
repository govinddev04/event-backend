const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const registrationRoutes = require('./routes/registrationRoutes')
const visitRoutes = require('./routes/visitRoutes')

dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working ✅' })
})

// Routes
app.use('/api', registrationRoutes)
app.use('/api', visitRoutes)

// Server start
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
})