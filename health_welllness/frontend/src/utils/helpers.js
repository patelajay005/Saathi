import { format, formatDistance, parseISO } from 'date-fns'

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return format(parsedDate, formatStr)
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  const parsedDate = typeof date === 'string' ? parseISO(date) : date
  return formatDistance(parsedDate, new Date(), { addSuffix: true })
}

export const getMoodEmoji = (emotion) => {
  const emojiMap = {
    happy: '😊',
    sad: '😢',
    anxious: '😰',
    calm: '😌',
    excited: '🤩',
    angry: '😠',
    tired: '😴',
    energetic: '⚡',
    stressed: '😫',
    neutral: '😐',
  }
  return emojiMap[emotion] || '😐'
}

export const getMoodColor = (score) => {
  if (score >= 8) return 'text-green-600 bg-green-100'
  if (score >= 6) return 'text-blue-600 bg-blue-100'
  if (score >= 4) return 'text-yellow-600 bg-yellow-100'
  return 'text-red-600 bg-red-100'
}

export const getScoreColor = (score) => {
  if (score >= 8) return 'bg-green-500'
  if (score >= 6) return 'bg-blue-500'
  if (score >= 4) return 'bg-yellow-500'
  return 'bg-red-500'
}

export const getTrendIcon = (trend) => {
  if (trend === 'improving') return '📈'
  if (trend === 'declining') return '📉'
  return '➡️'
}

export const getCategoryIcon = (category) => {
  const iconMap = {
    exercise: '🏃',
    meditation: '🧘',
    sleep: '😴',
    nutrition: '🥗',
    social: '👥',
    learning: '📚',
    creative: '🎨',
    CBT: '🧠',
    mindfulness: '🧘‍♀️',
    breathing: '💨',
    journaling: '📝',
    gratitude: '🙏',
    other: '⭐',
  }
  return iconMap[category] || '⭐'
}

export const calculateXPProgress = (xp, level) => {
  const currentLevelXP = (level - 1) * 100
  const nextLevelXP = level * 100
  const progress = xp - currentLevelXP
  const total = nextLevelXP - currentLevelXP
  return (progress / total) * 100
}

export const truncate = (str, length = 50) => {
  if (!str || str.length <= length) return str
  return str.slice(0, length) + '...'
}

export const cn = (...classes) => {
  return classes.filter(Boolean).join(' ')
}

