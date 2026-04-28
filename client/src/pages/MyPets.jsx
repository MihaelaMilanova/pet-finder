import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

const statusLabels = {
  LOST: { label: 'Изгубен', color: 'bg-red-100 text-red-600' },
  FOUND: { label: 'Намерен', color: 'bg-green-100 text-green-600' },
  HOME: { label: 'У дома', color: 'bg-orange-100 text-orange-600' },
}

export default function MyPets() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user])

  useEffect(() => {
    const fetchMyPets = async () => {
      try {
        const res = await api.get('/pets/my/pets')
        setPets(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMyPets()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Сигурен ли си че искаш да изтриеш тази обява?')) return
    try {
      await api.delete(`/pets/${id}`)
      setPets(pets.filter(p => p.id !== id))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-orange-500">Моите обяви</h2>
        <Link
          to="/create"
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          ➕ Добави обява
        </Link>
      </div>

      {loading ? (
        <p className="text-gray-500">Зареждане...</p>
      ) : pets.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-lg mb-4">Нямаш публикувани обяви.</p>
          <Link to="/create" className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition">
            Добави първата си обява
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pets.map(pet => (
            <div key={pet.id} className="bg-white rounded-xl shadow p-4 flex gap-4 items-center">
              {pet.imageUrl ? (
                <img src={pet.imageUrl} alt={pet.title} className="w-20 h-20 object-cover rounded-lg" />
              ) : (
                <div className="w-20 h-20 bg-orange-50 flex items-center justify-center text-3xl rounded-lg">
                  🐾
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-700">{pet.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusLabels[pet.status].color}`}>
                    {statusLabels[pet.status].label}
                  </span>
                </div>
                <p className="text-sm text-gray-400">📍 {pet.location}</p>
                {pet.animalType && <p className="text-sm text-gray-400">🐶 {pet.animalType.name}</p>}
              </div>
              <div className="flex gap-2">
                <Link
                  to={`/pets/${pet.id}`}
                  className="bg-orange-50 text-orange-600 px-3 py-1 rounded-lg text-sm hover:bg-orange-100 transition"
                >
                  Виж
                </Link>
                <button
                  onClick={() => handleDelete(pet.id)}
                  className="bg-red-50 text-red-500 px-3 py-1 rounded-lg text-sm hover:bg-red-100 transition"
                >
                  Изтрий
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}