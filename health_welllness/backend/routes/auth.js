const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Register
router.post('/register',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          error: { message: 'User with this email already exists' }
        });
      }

      // Create user
      const user = new User({ name, email, password });
      await user.save();

      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.status(201).json({
        message: 'User registered successfully',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          level: user.gamification.level,
          xp: user.gamification.xp,
          streak: user.gamification.streak
        }
      });
    } catch (error) {
      console.error('Register error:', error);
      res.status(500).json({ error: { message: 'Server error' } });
    }
  }
);

// Login
router.post('/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({
          error: { message: 'Invalid credentials' }
        });
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          error: { message: 'Invalid credentials' }
        });
      }

      // Generate token
      const token = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          level: user.gamification.level,
          xp: user.gamification.xp,
          streak: user.gamification.streak,
          badges: user.gamification.badges,
          preferences: user.preferences
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: { message: 'Server error' } });
    }
  }
);

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

// Update FCM token
router.post('/fcm-token', auth, async (req, res) => {
  try {
    const { fcmToken } = req.body;
    
    await User.findByIdAndUpdate(req.userId, { fcmToken });
    
    res.json({ message: 'FCM token updated successfully' });
  } catch (error) {
    console.error('Update FCM token error:', error);
    res.status(500).json({ error: { message: 'Server error' } });
  }
});

module.exports = router;

