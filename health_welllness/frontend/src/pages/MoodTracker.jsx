import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { moodAPI } from '../lib/api'
import { formatDate, getMoodEmoji, getMoodColor } from '../utils/helpers'

const emotions = [
  { value: 'happy', label: 'Happy', emoji: '😊' },
  { value: 'sad', label: 'Sad', emoji: '😢' },
  { value: 'anxious', label: 'Anxious', emoji: '😰' },
  { value: 'calm', label: 'Calm', emoji: '😌' },
  { value: 'excited', label: 'Excited', emoji: '🤩' },
  { value: 'angry', label: 'Angry', emoji: '😠' },
  { value: 'tired', label: 'Tired', emoji: '😴' },
  { value: 'energetic', label: 'Energetic', emoji: '⚡' },
  { value: 'stressed', label: 'Stressed', emoji: '😫' },
  { value: 'neutral', label: 'Neutral', emoji: '😐' },
]

const timeOfDayOptions = ['morning', 'afternoon', 'evening', 'night']

export default function MoodTracker() {
  const [showForm, setShowForm] = useState(false)
  const [moods, setMoods] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Form state
  const [score, setScore] = useState(5)
  const [emotion, setEmotion] = useState('neutral')
  const [notes, setNotes] = useState('')
  const [timeOfDay, setTimeOfDay] = useState('morning')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadMoods()
    checkTodayMood()
  }, [])

  const loadMoods = async () => {
    try {
      const response = await moodAPI.getHistory({ limit: 30 })
      setMoods(response.data.moods)
    } catch (error) {
      toast.error('Failed to load mood history')
    } finally {
      setLoading(false)
    }
  }

  const checkTodayMood = async () => {
    try {
      const response = await moodAPI.getToday()
      if (!response.data.hasLoggedToday) {
        setShowForm(true)
      }
    } catch (error) {
      console.error('Error checking today mood:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await moodAPI.logMood({
        score,
        emotion,
        notes,
        timeOfDay
      })

      toast.success('Mood logged successfully! +5 XP 🎯')
      setShowForm(false)
      loadMoods()
      
      // Reset form
      setScore(5)
      setEmotion('neutral')
      setNotes('')
    } catch (error) {
      toast.error('Failed to log mood')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mood Tracker</h1>
          <p className="text-gray-600 mt-1">Track and understand your emotions</p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            + Log Mood
          </button>
        )}
      </div>

      {/* Mood Logging Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card bg-gradient-to-br from-primary-50 to-accent-50 border-primary-100"
        >
          <h3 className="text-xl font-semibold mb-4">How are you feeling?</h3>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Mood Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mood Score: {score}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Low</span>
                <span>Very High</span>
              </div>
            </div>

            {/* Emotion Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Emotion
              </label>
              <div className="grid grid-cols-5 gap-3">
                {emotions.map((e) => (
                  <button
                    key={e.value}
                    type="button"
                    onClick={() => setEmotion(e.value)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      emotion === e.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-3xl">{e.emoji}</div>
                    <div className="text-xs mt-1">{e.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time of Day */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time of Day
              </label>
              <div className="flex gap-2">
                {timeOfDayOptions.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setTimeOfDay(time)}
                    className={`px-4 py-2 rounded-lg border capitalize transition-all ${
                      timeOfDay === time
                        ? 'border-primary-500 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="input"
                rows="3"
                placeholder="What's on your mind? Any triggers or activities?"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary"
              >
                {submitting ? 'Saving...' : 'Save Mood'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Mood History */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Mood History</h3>
        
        {moods.length === 0 ? (
          <p className="text-center text-gray-500 py-8">
            No mood entries yet. Log your first mood above!
          </p>
        ) : (
          <div className="space-y-3">
            {moods.map((mood) => (
              <motion.div
                key={mood._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-3xl">{getMoodEmoji(mood.emotion)}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{mood.emotion}</span>
                        <span className={`badge ${getMoodColor(mood.score)}`}>
                          {mood.score}/10
                        </span>
                        {mood.timeOfDay && (
                          <span className="text-xs text-gray-500 capitalize">
                            • {mood.timeOfDay}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {formatDate(mood.date, 'MMM dd, yyyy • h:mm a')}
                      </p>
                      {mood.notes && (
                        <p className="text-sm text-gray-700 mt-2">{mood.notes}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

