import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FireIcon,
  TrophyIcon,
  ChartBarIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'
import { scoreAPI, moodAPI, habitAPI, userAPI } from '../lib/api'
import { formatDate, getMoodEmoji, getScoreColor, calculateXPProgress } from '../utils/helpers'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const { user, updateUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [todayScore, setTodayScore] = useState(null)
  const [moodStats, setMoodStats] = useState(null)
  const [habits, setHabits] = useState([])
  const [scoreHistory, setScoreHistory] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      const [scoreRes, moodRes, habitRes, scoreHistoryRes] = await Promise.all([
        scoreAPI.getToday(),
        moodAPI.getStats({ period: 7 }),
        habitAPI.getAll({ isActive: true }),
        scoreAPI.getHistory({ limit: 7 }),
      ])

      setTodayScore(scoreRes.data.score)
      setMoodStats(moodRes.data)
      setHabits(habitRes.data.habits)
      
      // Format score history for chart
      const formattedHistory = scoreHistoryRes.data.scores
        .reverse()
        .map(s => ({
          date: formatDate(s.date, 'MM/dd'),
          score: s.overallScore
        }))
      setScoreHistory(formattedHistory)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const handleCheckIn = async () => {
    try {
      const response = await userAPI.checkIn()
      updateUser(response.data)
      toast.success(`Check-in successful! +10 XP 🎉\n${response.data.streak} day streak!`)
      loadDashboardData()
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Check-in failed')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const xpProgress = calculateXPProgress(user?.xp, user?.level)

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600 mt-1">
            {formatDate(new Date(), 'EEEE, MMMM dd, yyyy')}
          </p>
        </div>
        <button
          onClick={handleCheckIn}
          className="btn btn-accent"
        >
          Daily Check-in
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-orange-500 to-red-500 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Streak</p>
              <p className="text-3xl font-bold mt-1">{user?.streak} days</p>
            </div>
            <FireIcon className="w-12 h-12 text-orange-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Level</p>
              <p className="text-3xl font-bold mt-1">{user?.level}</p>
            </div>
            <TrophyIcon className="w-12 h-12 text-purple-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Today's Score</p>
              <p className="text-3xl font-bold mt-1">
                {todayScore ? todayScore.overallScore.toFixed(1) : '0'}/10
              </p>
            </div>
            <ChartBarIcon className="w-12 h-12 text-blue-100" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="card bg-gradient-to-br from-green-500 to-emerald-500 text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">XP</p>
              <p className="text-3xl font-bold mt-1">{user?.xp}</p>
            </div>
            <SparklesIcon className="w-12 h-12 text-green-100" />
          </div>
        </motion.div>
      </div>

      {/* XP Progress */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Level Progress</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Level {user?.level}</span>
            <span>{user?.xp} / {user?.level * 100} XP</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Score Trend (7 days)</h3>
          {scoreHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={scoreHistory}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  dot={{ fill: '#0ea5e9' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No data yet. Start logging your mood and habits!
            </p>
          )}
        </div>

        {/* Mood Stats */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Mood Overview (7 days)</h3>
          {moodStats && moodStats.totalEntries > 0 ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Average Mood</span>
                <span className="text-2xl font-bold">
                  {moodStats.averageScore.toFixed(1)}/10
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Entries</span>
                <span className="text-2xl font-bold">{moodStats.totalEntries}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Trend</span>
                <span className={`badge ${
                  moodStats.trend === 'improving' ? 'badge-success' :
                  moodStats.trend === 'declining' ? 'badge-error' :
                  'badge-info'
                }`}>
                  {moodStats.trend === 'improving' ? '📈 Improving' :
                   moodStats.trend === 'declining' ? '📉 Declining' :
                   '➡️ Stable'}
                </span>
              </div>
              {moodStats.emotionBreakdown && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">Common Emotions</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(moodStats.emotionBreakdown)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([emotion, count]) => (
                        <span key={emotion} className="badge badge-info">
                          {getMoodEmoji(emotion)} {emotion} ({count})
                        </span>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No mood data yet. <Link to="/mood" className="text-primary-600">Log your first mood</Link>
            </p>
          )}
        </div>
      </div>

      {/* Active Habits */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Active Habits</h3>
          <Link to="/habits" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all →
          </Link>
        </div>
        {habits.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {habits.slice(0, 4).map((habit) => (
              <div
                key={habit._id}
                className="p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{habit.icon} {habit.name}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {habit.streak} day streak 🔥
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            No habits yet. <Link to="/habits" className="text-primary-600">Create your first habit</Link>
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/mood" className="card hover:shadow-md transition-shadow text-center">
          <p className="text-3xl mb-2">💭</p>
          <p className="font-medium">Log Mood</p>
        </Link>
        <Link to="/chat" className="card hover:shadow-md transition-shadow text-center">
          <p className="text-3xl mb-2">💬</p>
          <p className="font-medium">AI Coach</p>
        </Link>
        <Link to="/exercises" className="card hover:shadow-md transition-shadow text-center">
          <p className="text-3xl mb-2">🧘</p>
          <p className="font-medium">Exercises</p>
        </Link>
        <Link to="/quizzes" className="card hover:shadow-md transition-shadow text-center">
          <p className="text-3xl mb-2">📝</p>
          <p className="font-medium">Quizzes</p>
        </Link>
      </div>

      {/* Insights */}
      {todayScore && todayScore.insights && todayScore.insights.length > 0 && (
        <div className="card bg-gradient-to-r from-primary-50 to-accent-50 border-primary-100">
          <h3 className="text-lg font-semibold mb-3">Today's Insights</h3>
          <ul className="space-y-2">
            {todayScore.insights.map((insight, index) => (
              <li key={index} className="flex items-start">
                <span className="text-primary-600 mr-2">✨</span>
                <span className="text-gray-700">{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {todayScore && todayScore.recommendations && todayScore.recommendations.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
          <ul className="space-y-2">
            {todayScore.recommendations.map((rec, index) => (
              <li key={index} className="flex items-start">
                <span className="text-accent-600 mr-2">💡</span>
                <span className="text-gray-700">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

