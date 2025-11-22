import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { exerciseAPI } from '../lib/api'
import { PlayIcon } from '@heroicons/react/24/solid'

export default function Exercises() {
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedExercise, setSelectedExercise] = useState(null)

  useEffect(() => {
    loadExercises()
  }, [])

  const loadExercises = async () => {
    try {
      const response = await exerciseAPI.getAll()
      setExercises(response.data.exercises)
    } catch (error) {
      toast.error('Failed to load exercises')
    } finally {
      setLoading(false)
    }
  }

  const handleComplete = async (exerciseId, duration) => {
    try {
      const response = await exerciseAPI.logCompletion({ exerciseId, duration, rating: 5, moodBefore: 5, moodAfter: 7 })
      toast.success(response.data.message)
      setSelectedExercise(null)
    } catch (error) {
      toast.error('Failed to log completion')
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Wellness Exercises</h1>
        <p className="text-gray-600 mt-1">CBT techniques, mindfulness & breathing exercises</p>
      </div>

      {selectedExercise ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card max-w-3xl mx-auto">
          <button onClick={() => setSelectedExercise(null)} className="text-primary-600 mb-4">← Back</button>
          <h2 className="text-2xl font-bold mb-2">{selectedExercise.title}</h2>
          <div className="flex gap-2 mb-4">
            <span className="badge badge-info">{selectedExercise.category}</span>
            <span className="badge badge-success">{selectedExercise.duration} min</span>
            <span className="badge badge-warning">{selectedExercise.difficulty}</span>
          </div>
          <p className="text-gray-700 mb-6">{selectedExercise.description}</p>
          
          <h3 className="font-semibold text-lg mb-3">Instructions</h3>
          <ol className="space-y-3 mb-6">
            {selectedExercise.instructions.map((inst, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-semibold text-primary-600">{i + 1}.</span>
                <span>{inst.text}</span>
              </li>
            ))}
          </ol>
          
          {selectedExercise.benefits && selectedExercise.benefits.length > 0 && (
            <>
              <h3 className="font-semibold text-lg mb-3">Benefits</h3>
              <ul className="space-y-2 mb-6">
                {selectedExercise.benefits.map((benefit, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          
          <button onClick={() => handleComplete(selectedExercise._id, selectedExercise.duration)} className="btn btn-accent w-full">
            Mark as Completed
          </button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map(exercise => (
            <motion.div key={exercise._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedExercise(exercise)}>
              <div className="flex items-center justify-between mb-3">
                <span className="badge badge-info">{exercise.category}</span>
                <span className="text-sm text-gray-600">{exercise.duration} min</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">{exercise.title}</h3>
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{exercise.description}</p>
              <button className="btn btn-primary btn-sm w-full">
                <PlayIcon className="w-4 h-4 mr-2" /> Start Exercise
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

