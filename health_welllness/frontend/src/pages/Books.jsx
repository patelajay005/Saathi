import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { bookAPI } from '../lib/api'

export default function Books() {
  const [books, setBooks] = useState([])
  const [myBooks, setMyBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    loadBooks()
  }, [])

  const loadBooks = async () => {
    try {
      const [allBooksRes, myBooksRes] = await Promise.all([
        bookAPI.getAll(),
        bookAPI.getLibrary()
      ])
      setBooks(allBooksRes.data.books)
      setMyBooks(myBooksRes.data.userBooks)
    } catch (error) {
      toast.error('Failed to load books')
    } finally {
      setLoading(false)
    }
  }

  const addToLibrary = async (bookId) => {
    try {
      await bookAPI.addToLibrary(bookId, 'want-to-read')
      toast.success('Book added to your library!')
      loadBooks()
    } catch (error) {
      toast.error(error.response?.data?.error?.message || 'Failed to add book')
    }
  }

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>

  const displayBooks = activeTab === 'all' ? books : myBooks

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Book Recommendations</h1>
        <p className="text-gray-600 mt-1">Curated books for mental health and wellness</p>
      </div>

      <div className="flex gap-4 border-b">
        <button onClick={() => setActiveTab('all')} className={`pb-3 font-medium ${activeTab === 'all' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600'}`}>
          All Books
        </button>
        <button onClick={() => setActiveTab('my')} className={`pb-3 font-medium ${activeTab === 'my' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-600'}`}>
          My Library ({myBooks.length})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayBooks.map(item => {
          const book = activeTab === 'my' ? item.bookId : item
          const isInLibrary = myBooks.some(ub => ub.bookId._id === book._id)
          
          return (
            <motion.div key={book._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card hover:shadow-lg transition-shadow">
              {book.coverImage && (
                <img src={book.coverImage} alt={book.title} className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
              <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
              <p className="text-sm text-gray-600 mb-3">by {book.author}</p>
              <div className="flex gap-2 mb-3">
                <span className="badge badge-info">{book.category}</span>
                <span className="badge badge-warning">{book.difficulty}</span>
              </div>
              <p className="text-sm text-gray-700 mb-4 line-clamp-3">{book.description}</p>
              {activeTab === 'all' && !isInLibrary && (
                <button onClick={() => addToLibrary(book._id)} className="btn btn-primary btn-sm w-full">
                  Add to Library
                </button>
              )}
              {activeTab === 'my' && (
                <div className="text-sm">
                  <span className="badge badge-success">{item.status.replace('-', ' ')}</span>
                  {item.progress > 0 && <span className="ml-2 text-gray-600">{item.progress}%</span>}
                </div>
              )}
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

