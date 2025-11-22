import React, { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { useAuthStore } from '../store/authStore'
import { userAPI } from '../lib/api'

export default function Profile() {
  const { user, updateUser } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [notificationsEnabled, setNotificationsEnabled] = useState(user?.preferences?.notificationsEnabled ?? true)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await userAPI.updateProfile({
        name,
        preferences: { notificationsEnabled }
      })
      updateUser(response.data.user)
      toast.success('Profile updated successfully!')
      setEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <p className="text-3xl font-bold text-primary-600">{user?.level}</p>
          <p className="text-sm text-gray-600 mt-1">Level</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-orange-600">{user?.streak}</p>
          <p className="text-sm text-gray-600 mt-1">Day Streak</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-purple-600">{user?.xp}</p>
          <p className="text-sm text-gray-600 mt-1">Total XP</p>
        </div>
        <div className="card text-center">
          <p className="text-3xl font-bold text-green-600">{user?.gamification?.badges?.length || 0}</p>
          <p className="text-sm text-gray-600 mt-1">Badges</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="card">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Personal Information</h3>
          {!editing && (
            <button onClick={() => setEditing(true)} className="btn btn-secondary btn-sm">
              Edit
            </button>
          )}
        </div>

        {editing ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="input" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" value={user?.email} disabled className="input bg-gray-100" />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div className="flex gap-3">
              <button onClick={handleSave} disabled={saving} className="btn btn-primary">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditing(false)} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="font-medium">{user?.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* Preferences */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-4">Preferences</h3>
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium">Push Notifications</p>
              <p className="text-sm text-gray-600">Receive daily reminders and updates</p>
            </div>
            <input type="checkbox" checked={notificationsEnabled} onChange={(e) => setNotificationsEnabled(e.target.checked)} className="w-5 h-5" />
          </label>
        </div>
      </div>

      {/* Badges */}
      {user?.gamification?.badges && user.gamification.badges.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {user.gamification.badges.map((badge, i) => (
              <div key={i} className="text-center p-4 bg-gradient-to-br from-primary-50 to-accent-50 rounded-lg">
                <div className="text-4xl mb-2">{badge.icon}</div>
                <p className="font-medium text-sm">{badge.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

