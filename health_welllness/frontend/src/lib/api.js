import axios from 'axios'
import { useAuthStore } from '../store/authStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  updateFCMToken: (token) => api.post('/auth/fcm-token', { fcmToken: token }),
}

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  completeOnboarding: () => api.post('/user/onboarding/complete'),
  getGamification: () => api.get('/user/gamification'),
  checkIn: () => api.post('/user/check-in'),
}

// Chat API
export const chatAPI = {
  createSession: () => api.post('/chat/session'),
  getSessions: () => api.get('/chat/sessions'),
  getSession: (sessionId) => api.get(`/chat/session/${sessionId}`),
  sendMessage: (data) => api.post('/chat/message', data),
  deleteSession: (sessionId) => api.delete(`/chat/session/${sessionId}`),
  suggestExercises: (message) => api.post('/chat/suggest-exercises', { message }),
}

// Mood API
export const moodAPI = {
  logMood: (data) => api.post('/mood', data),
  getHistory: (params) => api.get('/mood/history', { params }),
  getStats: (params) => api.get('/mood/stats', { params }),
  getToday: () => api.get('/mood/today'),
  updateMood: (moodId, data) => api.put(`/mood/${moodId}`, data),
  deleteMood: (moodId) => api.delete(`/mood/${moodId}`),
}

// Habit API
export const habitAPI = {
  create: (data) => api.post('/habit', data),
  getAll: (params) => api.get('/habit', { params }),
  getOne: (habitId) => api.get(`/habit/${habitId}`),
  complete: (habitId, notes) => api.post(`/habit/${habitId}/complete`, { notes }),
  update: (habitId, data) => api.put(`/habit/${habitId}`, data),
  delete: (habitId) => api.delete(`/habit/${habitId}`),
  getStats: (habitId) => api.get(`/habit/${habitId}/stats`),
}

// Exercise API
export const exerciseAPI = {
  getAll: (params) => api.get('/exercise', { params }),
  getOne: (exerciseId) => api.get(`/exercise/${exerciseId}`),
  logCompletion: (data) => api.post('/exercise/log', data),
  getHistory: (params) => api.get('/exercise/log/history', { params }),
  getStats: (params) => api.get('/exercise/log/stats', { params }),
}

// Quiz API
export const quizAPI = {
  getAll: (params) => api.get('/quiz', { params }),
  getOne: (quizId) => api.get(`/quiz/${quizId}`),
  submit: (quizId, answers) => api.post(`/quiz/${quizId}/submit`, { answers }),
  getHistory: () => api.get('/quiz/results/history'),
  getResult: (resultId) => api.get(`/quiz/results/${resultId}`),
}

// Score API
export const scoreAPI = {
  calculate: (date) => api.post('/score/calculate', { date }),
  getToday: () => api.get('/score/today'),
  getHistory: (params) => api.get('/score/history', { params }),
  getStats: (params) => api.get('/score/stats', { params }),
  getByDate: (date) => api.get(`/score/date/${date}`),
}

// Book API
export const bookAPI = {
  getAll: (params) => api.get('/books', { params }),
  getOne: (bookId) => api.get(`/books/${bookId}`),
  addToLibrary: (bookId, status) => api.post(`/books/${bookId}/add`, { status }),
  updateBook: (userBookId, data) => api.put(`/books/library/${userBookId}`, data),
  getLibrary: (params) => api.get('/books/library/my-books', { params }),
  removeFromLibrary: (userBookId) => api.delete(`/books/library/${userBookId}`),
  getRecommendations: () => api.get('/books/recommendations/personalized'),
}

// Notification API
export const notificationAPI = {
  updatePreferences: (data) => api.put('/notification/preferences', data),
  sendTest: () => api.post('/notification/test'),
}

export default api

