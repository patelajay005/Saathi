const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cron = require('node-cron');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat');
const moodRoutes = require('./routes/mood');
const habitRoutes = require('./routes/habit');
const exerciseRoutes = require('./routes/exercise');
const quizRoutes = require('./routes/quiz');
const scoreRoutes = require('./routes/score');
const notificationRoutes = require('./routes/notification');
const bookRoutes = require('./routes/book');

const { sendDailyReminders } = require('./services/notificationService');

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(compression());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🤝 Saathi - Your Wellness Companion API',
    version: '1.0.0',
    status: 'running',
    tagline: 'Walking with you on your wellness journey'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/mood', moodRoutes);
app.use('/api/habit', habitRoutes);
app.use('/api/exercise', exerciseRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/score', scoreRoutes);
app.use('/api/notification', notificationRoutes);
app.use('/api/books', bookRoutes);

// Schedule daily reminders (runs every day at 9 AM)
cron.schedule('0 9 * * *', () => {
  console.log('⏰ Running daily reminder job...');
  sendDailyReminders();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: {
      message: 'Route not found',
      status: 404
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

