const express = require('express');
const Mood = require('../models/Mood');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Log mood
router.post('/', auth, async (req, res) => {
  try {
    const { score, emotion, notes, triggers, activities, timeOfDay, weather, sleepHours } = req.body;
    
    if (!score || !emotion) {
      return res.status(400).json({
        error: { message: 'Score and emotion are required' }
      });
    }
    
    const mood = new Mood({
      userId: req.userId,
      score,
      emotion,
      notes,
      triggers,
      activities,
      timeOfDay,
      weather,
      sleepHours
    });
    
    await mood.save();
    
    // Award XP
    const user = await User.findById(req.userId);
    user.addXP(5);
    await user.save();
    
    res.status(201).json({
      message: 'Mood logged successfully! +5 XP',
      mood,
      xpEarned: 5
    });
  } catch (error) {
    console.error('Log mood error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get mood history
router.get('/history', auth, async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    
    const query = { userId: req.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const moods = await Mood.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));
    
    res.json({ moods });
  } catch (error) {
    console.error('Get mood history error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get mood statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const { period = '7' } = req.query; // days
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    const moods = await Mood.find({
      userId: req.userId,
      date: { $gte: startDate }
    });
    
    if (moods.length === 0) {
      return res.json({
        averageScore: 0,
        totalEntries: 0,
        emotionBreakdown: {},
        trend: 'stable'
      });
    }
    
    // Calculate average
    const averageScore = moods.reduce((sum, m) => sum + m.score, 0) / moods.length;
    
    // Emotion breakdown
    const emotionBreakdown = moods.reduce((acc, m) => {
      acc[m.emotion] = (acc[m.emotion] || 0) + 1;
      return acc;
    }, {});
    
    // Calculate trend
    const midpoint = Math.floor(moods.length / 2);
    const firstHalf = moods.slice(0, midpoint);
    const secondHalf = moods.slice(midpoint);
    
    const firstAvg = firstHalf.length > 0
      ? firstHalf.reduce((sum, m) => sum + m.score, 0) / firstHalf.length
      : 0;
    const secondAvg = secondHalf.length > 0
      ? secondHalf.reduce((sum, m) => sum + m.score, 0) / secondHalf.length
      : 0;
    
    const diff = secondAvg - firstAvg;
    let trend = 'stable';
    if (diff > 0.5) trend = 'improving';
    if (diff < -0.5) trend = 'declining';
    
    res.json({
      averageScore: Math.round(averageScore * 10) / 10,
      totalEntries: moods.length,
      emotionBreakdown,
      trend,
      period: parseInt(period)
    });
  } catch (error) {
    console.error('Get mood stats error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get today's mood
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const moods = await Mood.find({
      userId: req.userId,
      date: { $gte: today, $lt: tomorrow }
    }).sort({ date: -1 });
    
    res.json({ moods, hasLoggedToday: moods.length > 0 });
  } catch (error) {
    console.error('Get today mood error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update mood entry
router.put('/:moodId', auth, async (req, res) => {
  try {
    const { moodId } = req.params;
    const { score, emotion, notes, triggers, activities } = req.body;
    
    const mood = await Mood.findOneAndUpdate(
      { _id: moodId, userId: req.userId },
      { score, emotion, notes, triggers, activities },
      { new: true }
    );
    
    if (!mood) {
      return res.status(404).json({
        error: { message: 'Mood entry not found' }
      });
    }
    
    res.json({
      message: 'Mood updated successfully',
      mood
    });
  } catch (error) {
    console.error('Update mood error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Delete mood entry
router.delete('/:moodId', auth, async (req, res) => {
  try {
    const { moodId } = req.params;
    
    const mood = await Mood.findOneAndDelete({
      _id: moodId,
      userId: req.userId
    });
    
    if (!mood) {
      return res.status(404).json({
        error: { message: 'Mood entry not found' }
      });
    }
    
    res.json({ message: 'Mood entry deleted successfully' });
  } catch (error) {
    console.error('Delete mood error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;

