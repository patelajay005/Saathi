const mongoose = require('mongoose');

const dailyScoreSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  overallScore: {
    type: Number,
    required: true,
    min: 0,
    max: 10
  },
  components: {
    moodScore: {
      type: Number,
      min: 0,
      max: 10
    },
    habitScore: {
      type: Number,
      min: 0,
      max: 10
    },
    exerciseScore: {
      type: Number,
      min: 0,
      max: 10
    },
    sleepScore: {
      type: Number,
      min: 0,
      max: 10
    },
    engagementScore: {
      type: Number,
      min: 0,
      max: 10
    }
  },
  summary: {
    habitsCompleted: Number,
    totalHabits: Number,
    exercisesCompleted: Number,
    moodEntries: Number,
    minutesSpentOnExercises: Number
  },
  insights: [{
    type: String
  }],
  recommendations: [{
    type: String
  }],
  achievements: [{
    title: String,
    description: String,
    icon: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Unique index to ensure one score per user per day
dailyScoreSchema.index({ userId: 1, date: 1 }, { unique: true });

// Method to calculate overall score
dailyScoreSchema.statics.calculateDailyScore = async function(userId, date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const Mood = require('./Mood');
  const Habit = require('./Habit');
  const { UserExerciseLog } = require('./Exercise');
  
  // Get mood data
  const moods = await Mood.find({
    userId,
    date: { $gte: startOfDay, $lte: endOfDay }
  });
  
  const moodScore = moods.length > 0
    ? moods.reduce((sum, m) => sum + m.score, 0) / moods.length
    : 0;
  
  // Get habit data
  const habits = await Habit.find({ userId, isActive: true });
  const habitsCompletedToday = habits.filter(h => {
    const todayCompletion = h.completions.find(c => {
      const compDate = new Date(c.date);
      return compDate >= startOfDay && compDate <= endOfDay;
    });
    return todayCompletion && todayCompletion.completed;
  });
  
  const habitScore = habits.length > 0
    ? (habitsCompletedToday.length / habits.length) * 10
    : 0;
  
  // Get exercise data
  const exercises = await UserExerciseLog.find({
    userId,
    completedAt: { $gte: startOfDay, $lte: endOfDay }
  });
  
  const exerciseScore = Math.min((exercises.length * 2.5), 10);
  const totalMinutes = exercises.reduce((sum, e) => sum + (e.duration || 0), 0);
  
  // Calculate overall score (weighted average)
  const overallScore = (
    moodScore * 0.3 +
    habitScore * 0.4 +
    exerciseScore * 0.3
  );
  
  // Generate insights
  const insights = [];
  if (moodScore >= 7) insights.push("Great mood today! Keep up the positive energy! 🌟");
  if (moodScore < 5) insights.push("Your mood seems low. Consider trying a mindfulness exercise.");
  if (habitScore >= 8) insights.push("Excellent habit completion! You're building strong routines! 💪");
  if (habitScore < 5) insights.push("Try to complete more habits tomorrow for a better score.");
  if (exercises.length > 0) insights.push(`You completed ${exercises.length} wellness exercise(s) today! 🎯`);
  
  // Generate recommendations
  const recommendations = [];
  if (exercises.length === 0) recommendations.push("Try a 5-minute breathing exercise");
  if (moodScore < 6) recommendations.push("Practice gratitude journaling");
  if (habitScore < 7) recommendations.push("Focus on one habit at a time");
  
  return {
    userId,
    date: startOfDay,
    overallScore: Math.round(overallScore * 10) / 10,
    components: {
      moodScore: Math.round(moodScore * 10) / 10,
      habitScore: Math.round(habitScore * 10) / 10,
      exerciseScore: Math.round(exerciseScore * 10) / 10,
      sleepScore: 0, // Can be expanded
      engagementScore: 0 // Can be expanded
    },
    summary: {
      habitsCompleted: habitsCompletedToday.length,
      totalHabits: habits.length,
      exercisesCompleted: exercises.length,
      moodEntries: moods.length,
      minutesSpentOnExercises: totalMinutes
    },
    insights,
    recommendations
  };
};

module.exports = mongoose.model('DailyScore', dailyScoreSchema);

