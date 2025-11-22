const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true
  },
  context: {
    moodScore: Number,
    recentHabits: [String],
    currentStreak: Number,
    userLevel: Number
  },
  tokens: Number,
  model: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
chatMessageSchema.index({ userId: 1, sessionId: 1, timestamp: -1 });

const chatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    default: 'New Conversation'
  },
  summary: String,
  startedAt: {
    type: Date,
    default: Date.now
  },
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  messageCount: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Index for efficient querying
chatSessionSchema.index({ userId: 1, lastMessageAt: -1 });

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);
const ChatSession = mongoose.model('ChatSession', chatSessionSchema);

module.exports = { ChatMessage, ChatSession };

