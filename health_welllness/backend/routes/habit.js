const express = require('express');
const Habit = require('../models/Habit');
const User = require('../models/User');
const auth = require('../middleware/auth');
const notificationService = require('../services/notificationService');

const router = express.Router();

// Create habit
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, category, frequency, targetDays, reminderTime, color, icon } = req.body;
    
    if (!name) {
      return res.status(400).json({
        error: { message: 'Habit name is required' }
      });
    }
    
    const habit = new Habit({
      userId: req.userId,
      name,
      description,
      category,
      frequency,
      targetDays,
      reminderTime,
      color,
      icon
    });
    
    await habit.save();
    
    res.status(201).json({
      message: 'Habit created successfully!',
      habit
    });
  } catch (error) {
    console.error('Create habit error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get all habits
router.get('/', auth, async (req, res) => {
  try {
    const { isActive } = req.query;
    
    const query = { userId: req.userId };
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    const habits = await Habit.find(query).sort({ createdAt: -1 });
    
    res.json({ habits });
  } catch (error) {
    console.error('Get habits error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get single habit
router.get('/:habitId', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.habitId,
      userId: req.userId
    });
    
    if (!habit) {
      return res.status(404).json({
        error: { message: 'Habit not found' }
      });
    }
    
    res.json({ habit });
  } catch (error) {
    console.error('Get habit error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Mark habit as complete
router.post('/:habitId/complete', auth, async (req, res) => {
  try {
    const { notes } = req.body;
    
    const habit = await Habit.findOne({
      _id: req.params.habitId,
      userId: req.userId
    });
    
    if (!habit) {
      return res.status(404).json({
        error: { message: 'Habit not found' }
      });
    }
    
    const result = habit.markComplete(notes);
    habit.updatedAt = new Date();
    await habit.save();
    
    // Award XP
    const user = await User.findById(req.userId);
    const xpResult = user.addXP(10);
    await user.save();
    
    // Check for streak milestones and send notification
    if (habit.streak % 7 === 0 && habit.streak > 0) {
      await notificationService.sendStreakNotification(user, habit.streak);
    }
    
    res.json({
      message: result.alreadyCompleted 
        ? 'Already completed today!' 
        : `Habit completed! +10 XP 🎉 ${habit.streak} day streak!`,
      habit,
      streak: result.streak,
      xpEarned: result.alreadyCompleted ? 0 : 10,
      leveledUp: xpResult.leveledUp
    });
  } catch (error) {
    console.error('Complete habit error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update habit
router.put('/:habitId', auth, async (req, res) => {
  try {
    const { name, description, category, frequency, targetDays, reminderTime, color, icon, isActive } = req.body;
    
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.habitId, userId: req.userId },
      {
        name,
        description,
        category,
        frequency,
        targetDays,
        reminderTime,
        color,
        icon,
        isActive,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!habit) {
      return res.status(404).json({
        error: { message: 'Habit not found' }
      });
    }
    
    res.json({
      message: 'Habit updated successfully',
      habit
    });
  } catch (error) {
    console.error('Update habit error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Delete habit
router.delete('/:habitId', auth, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.habitId,
      userId: req.userId
    });
    
    if (!habit) {
      return res.status(404).json({
        error: { message: 'Habit not found' }
      });
    }
    
    res.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get habit statistics
router.get('/:habitId/stats', auth, async (req, res) => {
  try {
    const habit = await Habit.findOne({
      _id: req.params.habitId,
      userId: req.userId
    });
    
    if (!habit) {
      return res.status(404).json({
        error: { message: 'Habit not found' }
      });
    }
    
    // Calculate completion rate for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentCompletions = habit.completions.filter(c => 
      new Date(c.date) >= thirtyDaysAgo && c.completed
    );
    
    const completionRate = habit.frequency === 'daily' 
      ? (recentCompletions.length / 30) * 100
      : 0;
    
    res.json({
      stats: {
        currentStreak: habit.streak,
        bestStreak: habit.bestStreak,
        totalCompletions: habit.totalCompletions,
        completionRate: Math.round(completionRate),
        recentCompletions: recentCompletions.length,
        createdDaysAgo: Math.floor((Date.now() - habit.createdAt) / (1000 * 60 * 60 * 24))
      }
    });
  } catch (error) {
    console.error('Get habit stats error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;

