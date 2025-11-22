const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['stress', 'anxiety', 'depression', 'sleep', 'relationships', 'self-esteem', 'general'],
    required: true
  },
  questions: [{
    questionText: {
      type: String,
      required: true
    },
    questionType: {
      type: String,
      enum: ['multiple-choice', 'scale', 'yes-no', 'text'],
      default: 'multiple-choice'
    },
    options: [{
      text: String,
      score: Number
    }],
    scaleMin: Number,
    scaleMax: Number,
    order: Number
  }],
  scoring: {
    type: {
      type: String,
      enum: ['sum', 'average', 'category'],
      default: 'sum'
    },
    ranges: [{
      min: Number,
      max: Number,
      label: String,
      description: String,
      recommendations: [String]
    }]
  },
  duration: Number, // estimated duration in minutes
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const quizResultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Quiz',
    required: true
  },
  answers: [{
    questionId: mongoose.Schema.Types.ObjectId,
    answer: mongoose.Schema.Types.Mixed,
    score: Number
  }],
  totalScore: {
    type: Number,
    required: true
  },
  result: {
    label: String,
    description: String,
    recommendations: [String]
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
quizResultSchema.index({ userId: 1, completedAt: -1 });
quizResultSchema.index({ userId: 1, quizId: 1 });

const Quiz = mongoose.model('Quiz', quizSchema);
const QuizResult = mongoose.model('QuizResult', quizResultSchema);

module.exports = { Quiz, QuizResult };

