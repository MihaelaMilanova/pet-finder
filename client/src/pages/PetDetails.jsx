import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import Map from '../components/Map'


const statusLabels = {
  LOST: { label: 'Изгубен', color: 'bg-red-100 text-red-600' },
  FOUND: { label: 'Намерен', color: 'bg-green-100 text-green-600' },
  HOME: { label: 'У дома', color: 'bg-orange-100 text-orange-600' },
}

export default function PetDetails() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const res = await api.get(`/pets/${id}`)
        setPet(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPet()
  }, [id])

  const handleStatusChange = async (status) => {
    try {
      await api.patch(`/pets/${id}/status`, { status })
      setPet({ ...pet, status })
    } catch (err) {
      console.error(err)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Сигурен ли си че искаш да изтриеш тази обява?')) return
    try {
      await api.delete(`/pets/${id}`)
      navigate('/pets')
    } catch (err) {
      console.error(err)
    }
  }

  const handleComment = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post(`/comments/${id}`, { content: comment })
      setPet({ ...pet, comments: [res.data, ...pet.comments] })
      setComment('')
    } catch (err) {
      console.error(err)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`)
      setPet({ ...pet, comments: pet.comments.filter(c => c.id !== commentId) })
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) return <p className="text-gray-500">Зареждане...</p>
  if (!pet) return <p className="text-gray-500">Обявата не е намерена.</p>

  const isOwner = user?.id === pet.userId
  const isAdmin = user?.role === 'ADMIN'

  return (
    <div className="max-w-2xl mx-auto">
      {pet.imageUrl ? (
        <img
          src={pet.imageUrl}
          alt={pet.title}
          className="w-full h-72 object-cover rounded-xl mb-6"
        />
      ) : (
        <div className="w-full h-72 bg-orange-50 flex items-center justify-center text-7xl rounded-xl mb-6">
          🐾
        </div>
      )}


      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-gray-700">{pet.title}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusLabels[pet.status].color}`}>
            {statusLabels[pet.status].label}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{pet.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm text-gray-500 mb-4">
          <span>📍 {pet.location}</span>
          {pet.animalType && <span>🐶 {pet.animalType.name}</span>}
          {pet.breed && <span>🏷️ {pet.breed.name}</span>}
          {pet.color && <span>🎨 {pet.color}</span>}
          {pet.age && <span>🎂 {pet.age} год.</span>}
          <span>👤 {pet.user.name}</span>
        </div>

        
        <div className="mb-6">
            <Map location={pet.location} />
        </div>

          {!isOwner && (
  <Link
    to={`/messages?to=${pet.userId}`}
    className="flex items-center justify-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition text-sm font-medium mb-4"
  >
    ✉️ Свържи се с {pet.user.name}
  </Link>
)}
       

        {(isOwner || isAdmin) && (
          <div className="flex gap-2 flex-wrap mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500 self-center">Смени статус:</span>
            {['LOST', 'FOUND', 'HOME'].map(s => (
              <button
                key={s}
                onClick={() => handleStatusChange(s)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                  pet.status === s
                    ? 'bg-orange-500 text-white'
                    : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                }`}
              >
                {statusLabels[s].label}
              </button>
            ))}
            <button
              onClick={handleDelete}
              className="ml-auto px-3 py-1 bg-red-100 text-red-600 rounded-lg text-sm hover:bg-red-200 transition"
            >
              Изтрий
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-bold text-gray-700 mb-4">Коментари</h3>

        {user ? (
          <form onSubmit={handleComment} className="flex gap-2 mb-6">
            <input
              type="text"
              placeholder="Напиши коментар..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
            >
              Изпрати
            </button>
          </form>
        ) : (
          <p className="text-gray-500 mb-4 text-sm">
            <a href="/login" className="text-orange-500 hover:underline">Влез</a> за да коментираш.
          </p>
        )}

        {pet.comments.length === 0 ? (
          <p className="text-gray-400 text-sm">Няма коментари все още.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {pet.comments.map(c => (
              <div key={c.id} className="flex justify-between items-start bg-orange-50 rounded-lg p-3">
                <div>
                  <span className="font-medium text-orange-600 text-sm">{c.user.name}</span>
                  <p className="text-gray-600 text-sm mt-1">{c.content}</p>
                </div>
                {(user?.id === c.userId || isAdmin) && (
                  <button
                    onClick={() => handleDeleteComment(c.id)}
                    className="text-red-400 hover:text-red-600 text-xs ml-2"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}