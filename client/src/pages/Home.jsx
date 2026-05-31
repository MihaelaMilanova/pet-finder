import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import HomeMap from '../components/HomeMap'

export default function Home() {
  const [stats, setStats] = useState({ total: 0, lost: 0, found: 0 })
  const [recentPets, setRecentPets] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/pets')
        const pets = res.data
        setStats({
          total: pets.length,
          lost: pets.filter(p => p.status === 'LOST').length,
          found: pets.filter(p => p.status === 'FOUND').length,
        })
        setRecentPets(pets.slice(0, 3))
      } catch (err) {
        console.error(err)
      }
    }
    fetchData()
  }, [])

  const statusLabels = {
    LOST: { label: 'Изгубен', color: 'bg-red-100 text-red-600' },
    FOUND: { label: 'Намерен', color: 'bg-green-100 text-green-600' },
    HOME: { label: 'У дома', color: 'bg-orange-100 text-orange-600' },
  }

  return (
    <div>
      {/* Hero */}
      <div className="text-center py-8">
        <h1 className="text-5xl font-bold text-orange-500 mb-4">🐾 PetFinder</h1>
        <p className="text-xl text-gray-600 mb-8">
          Помагаме на изгубените домашни любимци да се приберат у дома!
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/pets?status=LOST" className="bg-red-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-red-600 transition">
            🔍 Изгубени
          </Link>
          <Link to="/pets?status=FOUND" className="bg-green-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-green-600 transition">
            ✅ Намерени
          </Link>
          <Link to="/create" className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-orange-600 transition">
            ➕ Добави обява
          </Link>
        </div>
      </div>

{/* Как работи */}
      <div className="grid grid-cols-3 gap-8 text-center mb-16">
        <div className="p-6 bg-orange-50 rounded-xl">
          <div className="text-4xl mb-3">📢</div>
          <h3 className="font-bold text-lg mb-2">Публикувай обява</h3>
          <p className="text-gray-500">Добави снимка и информация за твоя любимец</p>
        </div>
        <div className="p-6 bg-orange-50 rounded-xl">
          <div className="text-4xl mb-3">🔎</div>
          <h3 className="font-bold text-lg mb-2">Търси</h3>
          <p className="text-gray-500">Разгледай обявите за изгубени и намерени животни</p>
        </div>
        <div className="p-6 bg-orange-50 rounded-xl">
          <div className="text-4xl mb-3">🏠</div>
          <h3 className="font-bold text-lg mb-2">Прибери у дома</h3>
          <p className="text-gray-500">Свържи се с подалия обявата и помогни</p>
        </div>
      </div>
      {/* Статистика */}
      <div className="grid grid-cols-3 gap-6 mb-16">
        <div className="bg-orange-50 rounded-xl p-6 text-center">
          <p className="text-4xl font-bold text-orange-500">{stats.total}</p>
          <p className="text-gray-500 mt-1">Общо обяви</p>
        </div>
        <div className="bg-red-50 rounded-xl p-6 text-center">
          <p className="text-4xl font-bold text-red-500">{stats.lost}</p>
          <p className="text-gray-500 mt-1">Изгубени</p>
        </div>
        <div className="bg-green-50 rounded-xl p-6 text-center">
          <p className="text-4xl font-bold text-green-500">{stats.found}</p>
          <p className="text-gray-500 mt-1">Намерени</p>
        </div>
      </div>

  


<HomeMap />



      {/* Последни обяви */}
      {recentPets.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-700 mb-6">Последни обяви</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPets.map(pet => (
              <Link
                key={pet.id}
                to={`/pets/${pet.id}`}
                className="bg-white rounded-xl shadow hover:shadow-md transition overflow-hidden"
              >
                {pet.imageUrl ? (
                  <img src={pet.imageUrl} alt={pet.title} className="w-full h-48 object-cover" />
                ) : (
                  <div className="w-full h-48 bg-orange-50 flex items-center justify-center text-5xl">
                    🐾
                  </div>
                )}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-gray-700">{pet.title}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusLabels[pet.status].color}`}>
                      {statusLabels[pet.status].label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">📍 {pet.location}</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/pets" className="text-orange-500 hover:underline font-medium">
              Виж всички обяви →
            </Link>
          </div>
        </div>
      )}

      
    </div>
  )
}