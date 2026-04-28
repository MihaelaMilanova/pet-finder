import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user])

  if (!user) return null

  return (
    <div className="max-w-lg mx-auto mt-8">
      <div className="bg-white rounded-xl shadow p-8 text-center">
        <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
          🐾
        </div>
        <h2 className="text-2xl font-bold text-gray-700 mb-1">{user.name}</h2>
        <p className="text-gray-400 mb-2">{user.email}</p>
        <span className={`text-xs px-3 py-1 rounded-full font-medium ${
          user.role === 'ADMIN'
            ? 'bg-orange-100 text-orange-600'
            : 'bg-gray-100 text-gray-500'
        }`}>
          {user.role === 'ADMIN' ? 'Администратор' : 'Потребител'}
        </span>

        <div className="flex gap-3 justify-center mt-8">
          <Link
            to="/my-pets"
            className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Моите обяви
          </Link>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="bg-red-50 text-red-500 px-5 py-2 rounded-lg hover:bg-red-100 transition"
          >
            Изход
          </button>
        </div>
      </div>
    </div>
  )
}