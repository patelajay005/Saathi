const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['mental-health', 'mindfulness', 'CBT', 'self-help', 'psychology', 'meditation', 'habits', 'productivity', 'relationships', 'other'],
    required: true
  },
  coverImage: String,
  isbn: String,
  publicationYear: Number,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  tags: [{
    type: String
  }],
  keyTakeaways: [{
    type: String
  }],
  recommendedFor: [{
    type: String
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  amazonLink: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const userBookSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  status: {
    type: String,
    enum: ['want-to-read', 'reading', 'completed'],
    default: 'want-to-read'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  notes: String,
  startedAt: Date,
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for efficient querying
userBookSchema.index({ userId: 1, status: 1 });
userBookSchema.index({ userId: 1, bookId: 1 }, { unique: true });

const Book = mongoose.model('Book', bookSchema);
const UserBook = mongoose.model('UserBook', userBookSchema);

module.exports = { Book, UserBook };

