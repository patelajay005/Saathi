const express = require('express');
const DailyScore = require('../models/DailyScore');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate and save today's score
router.post('/calculate', auth, async (req, res) => {
  try {
    const { date } = req.body;
    const targetDate = date ? new Date(date) : new Date();
    targetDate.setHours(0, 0, 0, 0);
    
    // Check if score already exists for this date
    let dailyScore = await DailyScore.findOne({
      userId: req.userId,
      date: targetDate
    });
    
    // Calculate score
    const scoreData = await DailyScore.calculateDailyScore(req.userId, targetDate);
    
    if (dailyScore) {
      // Update existing score
      Object.assign(dailyScore, scoreData);
      await dailyScore.save();
    } else {
      // Create new score
      dailyScore = new DailyScore(scoreData);
      await dailyScore.save();
    }
    
    res.json({
      message: 'Daily score calculated',
      score: dailyScore
    });
  } catch (error) {
    console.error('Calculate score error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get today's score
router.get('/today', auth, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let dailyScore = await DailyScore.findOne({
      userId: req.userId,
      date: today
    });
    
    // If no score exists, calculate it
    if (!dailyScore) {
      const scoreData = await DailyScore.calculateDailyScore(req.userId, today);
      dailyScore = new DailyScore(scoreData);
      await dailyScore.save();
    }
    
    res.json({ score: dailyScore });
  } catch (error) {
    console.error('Get today score error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get score history
router.get('/history', auth, async (req, res) => {
  try {
    const { startDate, endDate, limit = 30 } = req.query;
    
    const query = { userId: req.userId };
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }
    
    const scores = await DailyScore.find(query)
      .sort({ date: -1 })
      .limit(parseInt(limit));
    
    res.json({ scores });
  } catch (error) {
    console.error('Get score history error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get score statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));
    
    const scores = await DailyScore.find({
      userId: req.userId,
      date: { $gte: startDate }
    }).sort({ date: 1 });
    
    if (scores.length === 0) {
      return res.json({
        averageScore: 0,
        totalDays: 0,
        trend: 'stable',
        bestDay: null,
        componentAverages: {}
      });
    }
    
    // Calculate average
    const averageScore = scores.reduce((sum, s) => sum + s.overallScore, 0) / scores.length;
    
    // Find best day
    const bestDay = scores.reduce((best, current) => 
      current.overallScore > best.overallScore ? current : best
    );
    
    // Calculate component averages
    const componentAverages = {
      moodScore: 0,
      habitScore: 0,
      exerciseScore: 0
    };
    
    scores.forEach(s => {
      componentAverages.moodScore += s.components.moodScore || 0;
      componentAverages.habitScore += s.components.habitScore || 0;
      componentAverages.exerciseScore += s.components.exerciseScore || 0;
    });
    
    Object.keys(componentAverages).forEach(key => {
      componentAverages[key] = Math.round((componentAverages[key] / scores.length) * 10) / 10;
    });
    
    // Calculate trend
    const midpoint = Math.floor(scores.length / 2);
    const firstHalf = scores.slice(0, midpoint);
    const secondHalf = scores.slice(midpoint);
    
    const firstAvg = firstHalf.reduce((sum, s) => sum + s.overallScore, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, s) => sum + s.overallScore, 0) / secondHalf.length;
    
    const diff = secondAvg - firstAvg;
    let trend = 'stable';
    if (diff > 0.5) trend = 'improving';
    if (diff < -0.5) trend = 'declining';
    
    res.json({
      averageScore: Math.round(averageScore * 10) / 10,
      totalDays: scores.length,
      trend,
      bestDay: {
        date: bestDay.date,
        score: bestDay.overallScore
      },
      componentAverages,
      period: parseInt(period)
    });
  } catch (error) {
    console.error('Get score stats error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get score by date
router.get('/date/:date', auth, async (req, res) => {
  try {
    const targetDate = new Date(req.params.date);
    targetDate.setHours(0, 0, 0, 0);
    
    let score = await DailyScore.findOne({
      userId: req.userId,
      date: targetDate
    });
    
    if (!score) {
      // Calculate score for that date
      const scoreData = await DailyScore.calculateDailyScore(req.userId, targetDate);
      score = new DailyScore(scoreData);
      await score.save();
    }
    
    res.json({ score });
  } catch (error) {
    console.error('Get score by date error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;

