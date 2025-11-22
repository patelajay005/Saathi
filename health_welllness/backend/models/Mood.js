const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  emotion: {
    type: String,
    enum: ['happy', 'sad', 'anxious', 'calm', 'excited', 'angry', 'tired', 'energetic', 'stressed', 'neutral'],
    required: true
  },
  notes: {
    type: String,
    maxlength: 500
  },
  triggers: [{
    type: String
  }],
  activities: [{
    type: String
  }],
  date: {
    type: Date,
    default: Date.now
  },
  timeOfDay: {
    type: String,
    enum: ['morning', 'afternoon', 'evening', 'night']
  },
  weather: String,
  sleepHours: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
moodSchema.index({ userId: 1, date: -1 });

// Get average mood for a date range
moodSchema.statics.getAverageMood = async function(userId, startDate, endDate) {
  return await this.aggregate([
    {
      $match: {
        userId: mongoose.Types.ObjectId(userId),
        date: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        averageScore: { $avg: '$score' },
        count: { $sum: 1 }
      }
    }
  ]);
};

module.exports = mongoose.model('Mood', moodSchema);

