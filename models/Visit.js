const mongoose = require('mongoose')

const visitSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    stallId: {
      type: String,
      required: true,
      trim: true,
    },
    stallName: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
)

// Ek attendee ek stall ko sirf ek baar visit kar sakta hai
visitSchema.index({ phone: 1, stallId: 1 }, { unique: true })

module.exports = mongoose.model('Visit', visitSchema)