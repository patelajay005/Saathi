const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, profilePicture, preferences } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (profilePicture) updateData.profilePicture = profilePicture;
    if (preferences) updateData.preferences = { ...req.user.preferences, ...preferences };
    
    updateData.updatedAt = new Date();
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');
    
    res.json({
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Complete onboarding
router.post('/onboarding/complete', auth, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { onboardingCompleted: true },
      { new: true }
    ).select('-password');
    
    // Award XP for completing onboarding
    user.addXP(50);
    await user.save();
    
    res.json({
      message: 'Onboarding completed! You earned 50 XP! 🎉',
      user
    });
  } catch (error) {
    console.error('Complete onboarding error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Get gamification stats
router.get('/gamification', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const xpToNextLevel = (user.gamification.level * 100) - user.gamification.xp;
    
    res.json({
      level: user.gamification.level,
      xp: user.gamification.xp,
      xpToNextLevel,
      streak: user.gamification.streak,
      badges: user.gamification.badges,
      lastCheckIn: user.gamification.lastCheckIn
    });
  } catch (error) {
    console.error('Get gamification error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update streak (daily check-in)
router.post('/check-in', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    const streakResult = user.updateStreak();
    const xpResult = user.addXP(10); // Award 10 XP for daily check-in
    
    await user.save();
    
    // Award badge for milestones
    if (user.gamification.streak === 7 && !user.gamification.badges.some(b => b.name === '7-Day Streak')) {
      user.gamification.badges.push({
        name: '7-Day Streak',
        earnedAt: new Date(),
        icon: '🔥'
      });
      await user.save();
    }
    
    res.json({
      message: 'Check-in successful!',
      streak: streakResult.streak,
      xp: user.gamification.xp,
      level: user.gamification.level,
      leveledUp: xpResult.leveledUp,
      newBadge: user.gamification.streak === 7 ? '7-Day Streak' : null
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;

