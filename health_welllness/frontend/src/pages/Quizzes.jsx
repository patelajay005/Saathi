import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { quizAPI } from '../lib/api'

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([])
  const [selectedQuiz, setSelectedQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = async () => {
    try {
      const response = await quizAPI.getAll()
      setQuizzes(response.data.quizzes)
    } catch (error) {
      toast.error('Failed to load quizzes')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitQuiz = async () => {
    if (Object.keys(answers).length < selectedQuiz.questions.length) {
      toast.error('Please answer all questions')
      return
    }

    setSubmitting(true)
    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer
      }))

      const response = await quizAPI.submit(selectedQuiz._id, formattedAnswers)
      setResult(response.data.result)
      toast.success(response.data.message)
    } catch (error) {
      toast.error('Failed to submit quiz')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>

  if (result) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-4">Quiz Results</h2>
          <div className="text-6xl mb-4">🎯</div>
          <h3 className="text-xl font-semibold mb-2">{result.result.label}</h3>
          <p className="text-gray-700 mb-4">{result.result.description}</p>
          <div className="text-left mt-6">
            <h4 className="font-semibold mb-3">Recommendations:</h4>
            <ul className="space-y-2">
              {result.result.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-primary-600">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
          <button onClick={() => { setSelectedQuiz(null); setResult(null); setAnswers({}) }} className="btn btn-primary mt-6">
            Back to Quizzes
          </button>
        </div>
      </div>
    )
  }

  if (selectedQuiz) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="card">
          <button onClick={() => setSelectedQuiz(null)} className="text-primary-600 mb-4">← Back</button>
          <h2 className="text-2xl font-bold mb-2">{selectedQuiz.title}</h2>
          <p className="text-gray-600 mb-6">{selectedQuiz.description}</p>
          
          <div className="space-y-6">
            {selectedQuiz.questions.map((q, index) => (
              <div key={q._id} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium mb-3">{index + 1}. {q.questionText}</p>
                {q.questionType === 'multiple-choice' && (
                  <div className="space-y-2">
                    {q.options.map((opt, i) => (
                      <label key={i} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={q._id} checked={answers[q._id] === opt.text} onChange={() => setAnswers({...answers, [q._id]: opt.text})} className="w-4 h-4" />
                        <span>{opt.text}</span>
                      </label>
                    ))}
                  </div>
                )}
                {q.questionType === 'scale' && (
                  <input type="range" min={q.scaleMin || 1} max={q.scaleMax || 10} value={answers[q._id] || q.scaleMin || 1} onChange={(e) => setAnswers({...answers, [q._id]: parseInt(e.target.value)})} className="w-full" />
                )}
              </div>
            ))}
          </div>
          
          <button onClick={handleSubmitQuiz} disabled={submitting} className="btn btn-accent w-full mt-6">
            {submitting ? 'Submitting...' : 'Submit Quiz'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Assessment Quizzes</h1>
        <p className="text-gray-600 mt-1">Take quizzes to understand your mental health better</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quizzes.map(quiz => (
          <motion.div key={quiz._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedQuiz(quiz)}>
            <div className="flex items-center justify-between mb-3">
              <span className="badge badge-info">{quiz.category}</span>
              <span className="text-sm text-gray-600">{quiz.duration} min</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{quiz.title}</h3>
            <p className="text-sm text-gray-600 mb-4">{quiz.description}</p>
            <p className="text-sm text-gray-500">{quiz.questions.length} questions</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

