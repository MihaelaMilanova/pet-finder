import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../api/axios'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user])

  useEffect(() => {
    api.get('/auth/profile').then(res => setProfile(res.data))
  }, [])

  if (!user || !profile) return null

  const joinDate = new Date(profile.createdAt).toLocaleDateString('bg-BG', {
    year: 'numeric', month: 'long', day: 'numeric'
  })

  return (
    <div className="max-w-lg mx-auto mt-8">
      <div className="bg-white rounded-xl shadow p-8">
        
        {/* Аватар и основна информация */}
        <div className="text-center mb-6">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
            🐾
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-1">{profile.name}</h2>
          <p className="text-gray-400 mb-3">{profile.email}</p>
          <span className={`text-xs px-3 py-1 rounded-full font-medium ${
            profile.role === 'ADMIN'
              ? 'bg-orange-100 text-orange-600'
              : 'bg-gray-100 text-gray-500'
          }`}>
            {profile.role === 'ADMIN' ? 'Администратор' : 'Потребител'}
          </span>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{profile._count.pets}</p>
            <p className="text-xs text-gray-500 mt-1">Обяви</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">{profile._count.comments}</p>
            <p className="text-xs text-gray-500 mt-1">Коментари</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-orange-500">
              {Math.floor((new Date() - new Date(profile.createdAt)) / (1000 * 60 * 60 * 24))}
            </p>
            <p className="text-xs text-gray-500 mt-1">Дни активен</p>
          </div>
        </div>

        {/* Дата на регистрация */}
        <p className="text-center text-sm text-gray-400 mb-6">
          Член от {joinDate}
        </p>

        {/* Бутони */}
        <div className="flex gap-3 justify-center">
          <Link
            to="/my-pets"
            className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600 transition"
          >
            Моите обяви
          </Link>
          <Link
            to="/messages"
            className="bg-orange-50 text-orange-600 px-5 py-2 rounded-lg hover:bg-orange-100 transition"
          >
            Съобщения
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