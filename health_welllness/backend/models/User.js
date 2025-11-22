const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: ''
  },
  fcmToken: {
    type: String,
    default: ''
  },
  preferences: {
    notificationsEnabled: {
      type: Boolean,
      default: true
    },
    reminderTime: {
      type: String,
      default: '09:00'
    },
    timezone: {
      type: String,
      default: 'UTC'
    },
    language: {
      type: String,
      default: 'en'
    }
  },
  gamification: {
    level: {
      type: Number,
      default: 1
    },
    xp: {
      type: Number,
      default: 0
    },
    streak: {
      type: Number,
      default: 0
    },
    lastCheckIn: {
      type: Date,
      default: null
    },
    badges: [{
      name: String,
      earnedAt: Date,
      icon: String
    }]
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'premium', 'enterprise'],
      default: 'free'
    },
    startDate: Date,
    endDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  onboardingCompleted: {
    type: Boolean,
    default: false
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

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update XP and level
userSchema.methods.addXP = function(points) {
  this.gamification.xp += points;
  
  // Level up calculation (100 XP per level)
  const newLevel = Math.floor(this.gamification.xp / 100) + 1;
  if (newLevel > this.gamification.level) {
    this.gamification.level = newLevel;
    return { leveledUp: true, newLevel };
  }
  
  return { leveledUp: false, newLevel: this.gamification.level };
};

// Update streak
userSchema.methods.updateStreak = function() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (!this.gamification.lastCheckIn) {
    this.gamification.streak = 1;
    this.gamification.lastCheckIn = new Date();
    return { streakUpdated: true, streak: 1 };
  }
  
  const lastCheckIn = new Date(this.gamification.lastCheckIn);
  lastCheckIn.setHours(0, 0, 0, 0);
  
  const daysDiff = Math.floor((today - lastCheckIn) / (1000 * 60 * 60 * 24));
  
  if (daysDiff === 1) {
    // Consecutive day
    this.gamification.streak += 1;
    this.gamification.lastCheckIn = new Date();
    return { streakUpdated: true, streak: this.gamification.streak };
  } else if (daysDiff === 0) {
    // Same day
    return { streakUpdated: false, streak: this.gamification.streak };
  } else {
    // Streak broken
    this.gamification.streak = 1;
    this.gamification.lastCheckIn = new Date();
    return { streakUpdated: true, streak: 1, streakBroken: true };
  }
};

module.exports = mongoose.model('User', userSchema);

