import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { habitAPI } from '../lib/api'
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline'

const categories = ['exercise', 'meditation', 'sleep', 'nutrition', 'social', 'learning', 'creative', 'other']
const colors = ['#ef4444', '#f97316', '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899']

export default function Habits() {
  const [habits, setHabits] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'other',
    frequency: 'daily',
    color: colors[0],
    icon: '⭐'
  })

  useEffect(() => {
    loadHabits()
  }, [])

  const loadHabits = async () => {
    try {
      const response = await habitAPI.getAll({ isActive: true })
      setHabits(response.data.habits)
    } catch (error) {
      toast.error('Failed to load habits')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await habitAPI.create(formData)
      toast.success('Habit created successfully!')
      setShowForm(false)
      setFormData({ name: '', description: '', category: 'other', frequency: 'daily', color: colors[0], icon: '⭐' })
      loadHabits()
    } catch (error) {
      toast.error('Failed to create habit')
    }
  }

  const handleComplete = async (habitId) => {
    try {
      const response = await habitAPI.complete(habitId)
      toast.success(response.data.message)
      loadHabits()
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to complete habit')
    }
  }

  if (loading) {
    return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Habits</h1>
          <p className="text-gray-600 mt-1">Build healthy routines</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary">
          <PlusIcon className="w-5 h-5 mr-2" /> Add Habit
        </button>
      </div>

      {showForm && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Create New Habit</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Habit Name</label>
              <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="input" placeholder="e.g., Morning Meditation" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="input">
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Icon</label>
              <input type="text" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className="input" placeholder="⭐" />
            </div>
            <div className="flex gap-3">
              <button type="submit" className="btn btn-primary">Create Habit</button>
              <button type="button" onClick={() => setShowForm(false)} className="btn btn-secondary">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {habits.map(habit => (
          <motion.div key={habit._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{habit.icon}</span>
                  <h3 className="font-semibold text-lg">{habit.name}</h3>
                </div>
                <p className="text-sm text-gray-600 mt-1">{habit.description}</p>
                <div className="mt-3 flex items-center gap-4 text-sm">
                  <span className="badge badge-info">{habit.category}</span>
                  <span className="text-gray-600">🔥 {habit.streak} day streak</span>
                  <span className="text-gray-600">✅ {habit.totalCompletions} completed</span>
                </div>
              </div>
              <button onClick={() => handleComplete(habit._id)} className="btn btn-primary">
                <CheckIcon className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {habits.length === 0 && !showForm && (
        <div className="text-center py-12">
          <p className="text-gray-500">No habits yet. Create your first habit to get started!</p>
        </div>
      )}
    </div>
  )
}

