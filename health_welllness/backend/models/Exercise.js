const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['CBT', 'mindfulness', 'breathing', 'journaling', 'gratitude', 'visualization', 'progressive-relaxation', 'other'],
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  instructions: [{
    step: Number,
    text: String,
    duration: Number // optional, in seconds
  }],
  benefits: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  audioUrl: String,
  videoUrl: String,
  imageUrl: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userExerciseLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise',
    required: true
  },
  completedAt: {
    type: Date,
    default: Date.now
  },
  duration: Number, // actual duration completed in minutes
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: String,
  moodBefore: {
    type: Number,
    min: 1,
    max: 10
  },
  moodAfter: {
    type: Number,
    min: 1,
    max: 10
  }
});

// Index for efficient querying
userExerciseLogSchema.index({ userId: 1, completedAt: -1 });

const Exercise = mongoose.model('Exercise', exerciseSchema);
const UserExerciseLog = mongoose.model('UserExerciseLog', userExerciseLogSchema);

module.exports = { Exercise, UserExerciseLog };

