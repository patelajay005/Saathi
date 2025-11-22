const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    maxlength: 300
  },
  category: {
    type: String,
    enum: ['exercise', 'meditation', 'sleep', 'nutrition', 'social', 'learning', 'creative', 'other'],
    default: 'other'
  },
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'custom'],
    default: 'daily'
  },
  targetDays: [{
    type: Number,
    min: 0,
    max: 6 // 0 = Sunday, 6 = Saturday
  }],
  reminderTime: String,
  color: {
    type: String,
    default: '#6366f1'
  },
  icon: {
    type: String,
    default: '⭐'
  },
  completions: [{
    date: {
      type: Date,
      default: Date.now
    },
    completed: {
      type: Boolean,
      default: true
    },
    notes: String
  }],
  streak: {
    type: Number,
    default: 0
  },
  bestStreak: {
    type: Number,
    default: 0
  },
  totalCompletions: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
habitSchema.index({ userId: 1, isActive: 1 });

// Method to mark habit as completed for today
habitSchema.methods.markComplete = function(notes = '') {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Check if already completed today
  const todayCompletion = this.completions.find(c => {
    const compDate = new Date(c.date);
    compDate.setHours(0, 0, 0, 0);
    return compDate.getTime() === today.getTime();
  });
  
  if (todayCompletion) {
    return { alreadyCompleted: true, streak: this.streak };
  }
  
  // Add completion
  this.completions.push({
    date: new Date(),
    completed: true,
    notes
  });
  
  this.totalCompletions += 1;
  
  // Update streak
  if (this.completions.length > 1) {
    const lastCompletion = new Date(this.completions[this.completions.length - 2].date);
    lastCompletion.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (lastCompletion.getTime() === yesterday.getTime()) {
      this.streak += 1;
    } else {
      this.streak = 1;
    }
  } else {
    this.streak = 1;
  }
  
  // Update best streak
  if (this.streak > this.bestStreak) {
    this.bestStreak = this.streak;
  }
  
  return { alreadyCompleted: false, streak: this.streak };
};

module.exports = mongoose.model('Habit', habitSchema);

