import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  BookOpenIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { useAuthStore } from '../store/authStore'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'AI Coach', href: '/chat', icon: ChatBubbleLeftRightIcon },
  { name: 'Mood Tracker', href: '/mood', icon: HeartIcon },
  { name: 'Habits', href: '/habits', icon: CheckCircleIcon },
  { name: 'Exercises', href: '/exercises', icon: AcademicCapIcon },
  { name: 'Quizzes', href: '/quizzes', icon: BookOpenIcon },
  { name: 'Books', href: '/books', icon: BookOpenIcon },
  { name: 'Profile', href: '/profile', icon: UserCircleIcon },
]

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white"
          >
            <div className="flex items-center justify-between px-4 py-4 border-b">
            <h1 className="text-xl font-bold text-primary-600">
              🤝 Saathi
            </h1>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon className="w-5 h-5 mr-3" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </motion.div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
          <div className="flex items-center px-4 py-6 border-b">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
              🤝 Saathi
            </h1>
          </div>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          {user && (
            <div className="p-4 border-t">
              <div className="flex items-center mb-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">{user.name}</p>
                  <p className="text-xs text-gray-500">Level {user.level} • {user.streak}🔥</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full btn btn-secondary text-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar for mobile */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 bg-white border-b lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-gray-100"
          >
            <Bars3Icon className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-primary-600">
            🤝 Saathi
          </h1>
          <div className="w-10" />
        </div>

        {/* Page content */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  )
}

