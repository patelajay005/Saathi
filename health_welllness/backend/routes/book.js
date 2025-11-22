const express = require('express');
const { Book, UserBook } = require('../models/Book');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all books
router.get('/', auth, async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    
    const query = { isActive: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    
    const books = await Book.find(query).sort({ rating: -1, createdAt: -1 });
    
    res.json({ books });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get single book
router.get('/:bookId', auth, async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    
    if (!book) {
      return res.status(404).json({
        error: { message: 'Book not found' }
      });
    }
    
    // Check if user has this book
    const userBook = await UserBook.findOne({
      userId: req.userId,
      bookId: req.params.bookId
    });
    
    res.json({
      book,
      userBook
    });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Add book to user library
router.post('/:bookId/add', auth, async (req, res) => {
  try {
    const { status = 'want-to-read' } = req.body;
    
    const book = await Book.findById(req.params.bookId);
    
    if (!book) {
      return res.status(404).json({
        error: { message: 'Book not found' }
      });
    }
    
    // Check if already exists
    let userBook = await UserBook.findOne({
      userId: req.userId,
      bookId: req.params.bookId
    });
    
    if (userBook) {
      return res.status(400).json({
        error: { message: 'Book already in your library' }
      });
    }
    
    userBook = new UserBook({
      userId: req.userId,
      bookId: req.params.bookId,
      status
    });
    
    if (status === 'reading') {
      userBook.startedAt = new Date();
    }
    
    await userBook.save();
    
    res.status(201).json({
      message: 'Book added to library',
      userBook
    });
  } catch (error) {
    console.error('Add book error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update user book
router.put('/library/:userBookId', auth, async (req, res) => {
  try {
    const { status, progress, rating, notes } = req.body;
    
    const updateData = {};
    if (status) {
      updateData.status = status;
      if (status === 'reading' && !updateData.startedAt) {
        updateData.startedAt = new Date();
      }
      if (status === 'completed') {
        updateData.completedAt = new Date();
        updateData.progress = 100;
      }
    }
    if (progress !== undefined) updateData.progress = progress;
    if (rating) updateData.rating = rating;
    if (notes) updateData.notes = notes;
    
    const userBook = await UserBook.findOneAndUpdate(
      { _id: req.params.userBookId, userId: req.userId },
      updateData,
      { new: true }
    ).populate('bookId');
    
    if (!userBook) {
      return res.status(404).json({
        error: { message: 'Book not found in your library' }
      });
    }
    
    res.json({
      message: 'Book updated successfully',
      userBook
    });
  } catch (error) {
    console.error('Update user book error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get user's library
router.get('/library/my-books', auth, async (req, res) => {
  try {
    const { status } = req.query;
    
    const query = { userId: req.userId };
    if (status) query.status = status;
    
    const userBooks = await UserBook.find(query)
      .populate('bookId')
      .sort({ createdAt: -1 });
    
    res.json({ userBooks });
  } catch (error) {
    console.error('Get user library error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Remove book from library
router.delete('/library/:userBookId', auth, async (req, res) => {
  try {
    const userBook = await UserBook.findOneAndDelete({
      _id: req.params.userBookId,
      userId: req.userId
    });
    
    if (!userBook) {
      return res.status(404).json({
        error: { message: 'Book not found in your library' }
      });
    }
    
    res.json({ message: 'Book removed from library' });
  } catch (error) {
    console.error('Remove book error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get recommended books based on user data
router.get('/recommendations/personalized', auth, async (req, res) => {
  try {
    // Simple recommendation: suggest books based on what user hasn't read yet
    const userBooks = await UserBook.find({ userId: req.userId });
    const userBookIds = userBooks.map(ub => ub.bookId.toString());
    
    const recommendations = await Book.find({
      _id: { $nin: userBookIds },
      isActive: true
    })
      .sort({ rating: -1 })
      .limit(10);
    
    res.json({ recommendations });
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;

