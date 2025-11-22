import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from './store/authStore'

// Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Chat from './pages/Chat'
import MoodTracker from './pages/MoodTracker'
import Habits from './pages/Habits'
import Exercises from './pages/Exercises'
import Quizzes from './pages/Quizzes'
import Books from './pages/Books'
import Profile from './pages/Profile'

// Layout
import Layout from './components/Layout'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { token } = useAuthStore()
  return token ? children : <Navigate to="/login" />
}

// Public Route Component (redirect to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { token } = useAuthStore()
  return token ? <Navigate to="/dashboard" /> : children
}

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/chat" element={<ProtectedRoute><Layout><Chat /></Layout></ProtectedRoute>} />
        <Route path="/mood" element={<ProtectedRoute><Layout><MoodTracker /></Layout></ProtectedRoute>} />
        <Route path="/habits" element={<ProtectedRoute><Layout><Habits /></Layout></ProtectedRoute>} />
        <Route path="/exercises" element={<ProtectedRoute><Layout><Exercises /></Layout></ProtectedRoute>} />
        <Route path="/quizzes" element={<ProtectedRoute><Layout><Quizzes /></Layout></ProtectedRoute>} />
        <Route path="/books" element={<ProtectedRoute><Layout><Books /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  )
}

export default App

