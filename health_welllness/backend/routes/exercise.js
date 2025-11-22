const express = require('express');
const { Exercise, UserExerciseLog } = require('../models/Exercise');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all exercises
router.get('/', auth, async (req, res) => {
  try {
    const { category, difficulty } = req.query;
    
    const query = { isActive: true };
    if (category) query.category = category;
    if (difficulty) query.difficulty = difficulty;
    
    const exercises = await Exercise.find(query).sort({ createdAt: -1 });
    
    res.json({ exercises });
  } catch (error) {
    console.error('Get exercises error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get single exercise
router.get('/:exerciseId', auth, async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.exerciseId);
    
    if (!exercise) {
      return res.status(404).json({
        error: { message: 'Exercise not found' }
      });
    }
    
    res.json({ exercise });
  } catch (error) {
    console.error('Get exercise error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Log exercise completion
router.post('/log', auth, async (req, res) => {
  try {
    const { exerciseId, duration, rating, notes, moodBefore, moodAfter } = req.body;
    
    if (!exerciseId) {
      return res.status(400).json({
        error: { message: 'Exercise ID is required' }
      });
    }
    
    const log = new UserExerciseLog({
      userId: req.userId,
      exerciseId,
      duration,
      rating,
      notes,
      moodBefore,
      moodAfter
    });
    
    await log.save();
    
    // Award XP
    const user = await User.findById(req.userId);
    const xpEarned = 15;
    const xpResult = user.addXP(xpEarned);
    await user.save();
    
    res.status(201).json({
      message: `Exercise completed! +${xpEarned} XP 🎯`,
      log,
      xpEarned,
      leveledUp: xpResult.leveledUp,
      newLevel: xpResult.newLevel
    });
  } catch (error) {
    console.error('Log exercise error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get user's exercise history
router.get('/log/history', auth, async (req, res) => {
  try {
    const { limit = 30 } = req.query;
    
    const logs = await UserExerciseLog.find({ userId: req.userId })
      .populate('exerciseId')
      .sort({ completedAt: -1 })
      .limit(parseInt(limit));
    
    res.json({ logs });
  } catch (error) {
    console.error('Get exercise history error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get exercise statistics
router.get('/log/stats', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    const logs = await UserExerciseLog.find({
      userId: req.userId,
      completedAt: { $gte: startDate }
    });
    
    const totalMinutes = logs.reduce((sum, log) => sum + (log.duration || 0), 0);
    const totalExercises = logs.length;
    
    // Category breakdown
    const categoryBreakdown = {};
    for (const log of logs) {
      const exercise = await Exercise.findById(log.exerciseId);
      if (exercise) {
        categoryBreakdown[exercise.category] = (categoryBreakdown[exercise.category] || 0) + 1;
      }
    }
    
    // Average rating
    const ratedLogs = logs.filter(log => log.rating);
    const averageRating = ratedLogs.length > 0
      ? ratedLogs.reduce((sum, log) => sum + log.rating, 0) / ratedLogs.length
      : 0;
    
    res.json({
      totalExercises,
      totalMinutes,
      averageRating: Math.round(averageRating * 10) / 10,
      categoryBreakdown,
      period: parseInt(period)
    });
  } catch (error) {
    console.error('Get exercise stats error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;

