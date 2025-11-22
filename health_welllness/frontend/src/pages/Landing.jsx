import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ChartBarIcon,
  SparklesIcon,
  CheckCircleIcon,
  BookOpenIcon,
} from '@heroicons/react/24/outline'

const features = [
  {
    name: 'AI-Powered Coach',
    description: 'Chat with your personal AI wellness coach 24/7 for support and guidance.',
    icon: ChatBubbleLeftRightIcon,
  },
  {
    name: 'Mood Tracking',
    description: 'Monitor your emotional well-being with daily mood logs and insights.',
    icon: HeartIcon,
  },
  {
    name: 'Habit Building',
    description: 'Create and track healthy habits with gamification and streaks.',
    icon: CheckCircleIcon,
  },
  {
    name: 'Daily Scores',
    description: 'Get personalized daily wellness scores and track your progress over time.',
    icon: ChartBarIcon,
  },
  {
    name: 'CBT & Mindfulness',
    description: 'Access evidence-based exercises, breathing techniques, and meditation.',
    icon: SparklesIcon,
  },
  {
    name: 'Book Recommendations',
    description: 'Discover curated books to improve your mental health and well-being.',
    icon: BookOpenIcon,
  },
]

export default function Landing() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-16 sm:py-24 lg:py-32">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Meet{' '}
                <span className="bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                  Saathi
                </span>{' '}
                <br />Your Wellness Companion
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
                Monitor your mood, build healthy habits, and improve your mental well-being
                with AI-powered support, personalized exercises, and daily insights.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  to="/register"
                  className="btn btn-accent px-8 py-3 text-lg shadow-lg hover:shadow-xl"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="text-lg font-semibold leading-6 text-gray-900 hover:text-primary-600"
                >
                  Sign in <span aria-hidden="true">→</span>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute inset-x-0 top-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-primary-400 to-accent-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Everything you need for better mental health
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Comprehensive tools and features designed by mental health professionals
          </p>
        </motion.div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary-500 to-accent-500">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {feature.name}
                </h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to start your wellness journey?
            </h2>
            <p className="mt-4 text-lg text-primary-100">
              Join thousands of users improving their mental health every day
            </p>
            <div className="mt-8">
              <Link
                to="/register"
                className="inline-block bg-white px-8 py-3 text-lg font-semibold text-primary-600 rounded-lg shadow-xl hover:bg-gray-50 transition-colors"
              >
                Start Free Today
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-50 border-t">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <p className="text-center text-gray-500">
            © 2024 Saathi. Built with ❤️ for better mental health.
          </p>
        </div>
      </footer>
    </div>
  )
}

