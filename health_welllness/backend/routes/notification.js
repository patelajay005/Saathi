const express = require('express');
const User = require('../models/User');
const notificationService = require('../services/notificationService');
const auth = require('../middleware/auth');

const router = express.Router();

// Update notification preferences
router.put('/preferences', auth, async (req, res) => {
  try {
    const { notificationsEnabled, reminderTime, timezone } = req.body;
    
    const updateData = {};
    if (notificationsEnabled !== undefined) {
      updateData['preferences.notificationsEnabled'] = notificationsEnabled;
    }
    if (reminderTime) {
      updateData['preferences.reminderTime'] = reminderTime;
    }
    if (timezone) {
      updateData['preferences.timezone'] = timezone;
    }
    
    const user = await User.findByIdAndUpdate(
      req.userId,
      updateData,
      { new: true }
    ).select('-password');
    
    res.json({
      message: 'Notification preferences updated',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update notification preferences error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Test notification (for development/testing)
router.post('/test', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    
    if (!user.fcmToken) {
      return res.status(400).json({
        error: { message: 'No FCM token registered for this user' }
      });
    }
    
    const result = await notificationService.sendPushNotification(user.fcmToken, {
      title: '🧪 Test Notification',
      body: 'This is a test notification from your AI Wellness Coach!',
      data: {
        type: 'test'
      }
    });
    
    res.json({
      message: 'Test notification sent',
      result
    });
  } catch (error) {
    console.error('Send test notification error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Send custom notification to user (admin/system use)
router.post('/send', auth, async (req, res) => {
  try {
    const { title, body, data } = req.body;
    
    const user = await User.findById(req.userId);
    
    if (!user.fcmToken) {
      return res.status(400).json({
        error: { message: 'No FCM token registered for this user' }
      });
    }
    
    const result = await notificationService.sendPushNotification(user.fcmToken, {
      title,
      body,
      data: data || {}
    });
    
    res.json({
      message: 'Notification sent',
      result
    });
  } catch (error) {
    console.error('Send notification error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;

