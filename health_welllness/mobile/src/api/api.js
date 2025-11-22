import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:5000/api'; // Change to your API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  checkIn: () => api.post('/user/check-in'),
  getGamification: () => api.get('/user/gamification'),
};

// Chat API
export const chatAPI = {
  createSession: () => api.post('/chat/session'),
  getSessions: () => api.get('/chat/sessions'),
  getSession: (sessionId) => api.get(`/chat/session/${sessionId}`),
  sendMessage: (data) => api.post('/chat/message', data),
};

// Mood API
export const moodAPI = {
  logMood: (data) => api.post('/mood', data),
  getHistory: (params) => api.get('/mood/history', { params }),
  getStats: (params) => api.get('/mood/stats', { params }),
  getToday: () => api.get('/mood/today'),
};

// Habit API
export const habitAPI = {
  create: (data) => api.post('/habit', data),
  getAll: (params) => api.get('/habit', { params }),
  complete: (habitId, notes) => api.post(`/habit/${habitId}/complete`, { notes }),
  update: (habitId, data) => api.put(`/habit/${habitId}`, data),
  delete: (habitId) => api.delete(`/habit/${habitId}`),
};

// Score API
export const scoreAPI = {
  getToday: () => api.get('/score/today'),
  getHistory: (params) => api.get('/score/history', { params }),
  getStats: (params) => api.get('/score/stats', { params }),
};

export default api;

