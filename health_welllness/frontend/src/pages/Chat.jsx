import React, { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { chatAPI } from '../lib/api'
import { useAuthStore } from '../store/authStore'
import { formatRelativeTime } from '../utils/helpers'

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'pt', name: 'Português', flag: '🇵🇹' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' }
]

export default function Chat() {
  const { user } = useAuthStore()
  const [sessions, setSessions] = useState([])
  const [currentSession, setCurrentSession] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState('en')
  const [showLanguageMenu, setShowLanguageMenu] = useState(false)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    loadSessions()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadSessions = async () => {
    try {
      const response = await chatAPI.getSessions()
      setSessions(response.data.sessions)
      
      if (response.data.sessions.length > 0) {
        loadSession(response.data.sessions[0].sessionId)
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }

  const loadSession = async (sessionId) => {
    setLoading(true)
    try {
      const response = await chatAPI.getSession(sessionId)
      setCurrentSession(response.data.session)
      setMessages(response.data.messages)
    } catch (error) {
      toast.error('Failed to load conversation')
    } finally {
      setLoading(false)
    }
  }

  const createNewSession = async () => {
    try {
      const response = await chatAPI.createSession()
      setSessions([response.data.session, ...sessions])
      setCurrentSession(response.data.session)
      setMessages([])
      toast.success('New conversation started!')
    } catch (error) {
      toast.error('Failed to create new conversation')
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!input.trim() || sendingMessage) return

    let sessionId = currentSession?.sessionId

    // Create session if none exists
    if (!sessionId) {
      try {
        const response = await chatAPI.createSession()
        sessionId = response.data.session.sessionId
        setCurrentSession(response.data.session)
        setSessions([response.data.session, ...sessions])
      } catch (error) {
        toast.error('Failed to start conversation')
        return
      }
    }

    const userMessage = input.trim()
    setInput('')
    setSendingMessage(true)

    // Add user message to UI immediately
    const tempUserMsg = {
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, tempUserMsg])

    try {
      const response = await chatAPI.sendMessage({
        sessionId,
        message: userMessage,
        language: selectedLanguage
      })

      // Replace temp message and add AI response
      setMessages(prev => [
        ...prev.slice(0, -1),
        response.data.userMessage,
        response.data.assistantMessage
      ])

      if (response.data.xpEarned) {
        toast.success(`+${response.data.xpEarned} XP earned! 🎯`)
      }
    } catch (error) {
      toast.error('Failed to send message')
      // Remove temp message on error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setSendingMessage(false)
    }
  }

  return (
    <div className="h-[calc(100vh-180px)] flex gap-6">
      {/* Sidebar - Sessions */}
      <div className="w-64 card overflow-y-auto">
        <button
          onClick={createNewSession}
          className="w-full btn btn-primary mb-4"
        >
          + New Chat
        </button>
        
        <div className="space-y-2">
          {sessions.map((session) => (
            <button
              key={session.sessionId}
              onClick={() => loadSession(session.sessionId)}
              className={`w-full text-left p-3 rounded-lg transition-colors ${
                currentSession?.sessionId === session.sessionId
                  ? 'bg-primary-50 border border-primary-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <p className="font-medium text-sm truncate">{session.title}</p>
              <p className="text-xs text-gray-500 mt-1">
                {formatRelativeTime(session.lastMessageAt)}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 card flex flex-col">
        {/* Language Selector */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b">
          <h2 className="text-lg font-semibold">Saathi - Your AI Companion</h2>
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-xl">
                {languages.find(l => l.code === selectedLanguage)?.flag}
              </span>
              <span className="text-sm font-medium">
                {languages.find(l => l.code === selectedLanguage)?.name}
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {showLanguageMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-10 max-h-96 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setSelectedLanguage(lang.code)
                      setShowLanguageMenu(false)
                      toast.success(`Language changed to ${lang.name}`)
                    }}
                    className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-50 transition-colors ${
                      selectedLanguage === lang.code ? 'bg-primary-50' : ''
                    }`}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-sm">{lang.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="text-6xl mb-4">🌟</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Namaste, {user?.name}! 🙏
                  </h3>
                  <p className="text-gray-600 max-w-md">
                    I'm Saathi, your wellness companion. I'm here to walk with you on your mental health journey,
                    listen without judgment, and support you every step of the way. What would you like to talk about today?
                  </p>
                </div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg px-4 py-3 ${
                        message.role === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.role === 'user' ? 'text-primary-100' : 'text-gray-500'
                      }`}>
                        {formatRelativeTime(message.timestamp)}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
              {sendingMessage && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-4 py-3">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="input flex-1"
                disabled={sendingMessage}
              />
              <button
                type="submit"
                disabled={!input.trim() || sendingMessage}
                className="btn btn-primary"
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

