import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import Spinner from '../components/Spinner'


const statusLabels = {
  LOST: { label: 'Изгубен', color: 'bg-red-100 text-red-600' },
  FOUND: { label: 'Намерен', color: 'bg-green-100 text-green-600' },
  HOME: { label: 'У дома', color: 'bg-orange-100 text-orange-600' },
}

export default function Pets() {
  const [pets, setPets] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [searchParams, setSearchParams] = useSearchParams()
  const status = searchParams.get('status') || ''

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true)
      try {
        const res = await api.get('/pets', { params: status ? { status } : {} })
        setPets(res.data)
        setFiltered(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPets()
  }, [status])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(
      pets.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.animalType?.name.toLowerCase().includes(q)
      )
    )
  }, [search, pets])

  return (
    <div>
      <h2 className="text-3xl font-bold text-orange-500 mb-6">Обяви</h2>

      <div className="flex gap-3 mb-4">
        {['', 'LOST', 'FOUND', 'HOME'].map((s) => (
          <button
            key={s}
            onClick={() => setSearchParams(s ? { status: s } : {})}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              status === s
                ? 'bg-orange-500 text-white'
                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
            }`}
          >
            {s === '' ? 'Всички' : statusLabels[s].label}
          </button>
        ))}
      </div>

      <input
        type="text"
        placeholder="🔍 Търси по заглавие, град, вид животно..."
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-8 focus:outline-none focus:ring-2 focus:ring-orange-400"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <p className="text-gray-500">Зареждане...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">Няма намерени обяви.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((pet) => (
            <Link
              key={pet.id}
              to={`/pets/${pet.id}`}
              className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
            >
              {pet.imageUrl ? (
                <img
                  src={pet.imageUrl}
                  alt={pet.title}
                  className="w-full h-48 object-cover"
                />
              ) : (
                <div className="w-full h-48 bg-orange-50 flex items-center justify-center text-5xl">
                  🐾
                </div>
              )}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-700 text-lg">{pet.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusLabels[pet.status].color}`}>
                    {statusLabels[pet.status].label}
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-2 line-clamp-2">{pet.description}</p>
                <div className="flex gap-2 text-xs text-gray-400">
                  <span>📍 {pet.location}</span>
                  {pet.animalType && <span>• {pet.animalType.name}</span>}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}