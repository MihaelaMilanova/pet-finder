import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [animalTypes, setAnimalTypes] = useState([])
  const [newType, setNewType] = useState('')
  const [newBreed, setNewBreed] = useState({ name: '', animalTypeId: '' })
  const [activeTab, setActiveTab] = useState('users')

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') navigate('/')
  }, [user])

  useEffect(() => {
    fetchUsers()
    fetchAnimalTypes()
  }, [])

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchAnimalTypes = async () => {
    try {
      const res = await api.get('/admin/animal-types')
      setAnimalTypes(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleRoleChange = async (id, role) => {
    try {
      await api.patch(`/admin/users/${id}/role`, { role })
      setUsers(users.map(u => u.id === id ? { ...u, role } : u))
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddType = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/animal-types', { name: newType })
      setNewType('')
      fetchAnimalTypes()
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddBreed = async (e) => {
    e.preventDefault()
    try {
      await api.post('/admin/breeds', newBreed)
      setNewBreed({ name: '', animalTypeId: '' })
      fetchAnimalTypes()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-orange-500 mb-6">Администрация</h2>

      <div className="flex gap-3 mb-8">
        {['users', 'animals'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              activeTab === tab
                ? 'bg-orange-500 text-white'
                : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
            }`}
          >
            {tab === 'users' ? 'Потребители' : 'Видове и породи'}
          </button>
        ))}
      </div>

      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-bold text-gray-700 mb-4">Потребители</h3>
          <div className="flex flex-col gap-3">
            {users.map(u => (
              <div key={u.id} className="flex justify-between items-center border-b border-gray-100 pb-3">
                <div>
                  <p className="font-medium text-gray-700">{u.name}</p>
                  <p className="text-sm text-gray-400">{u.email}</p>
                </div>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'animals' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Добави вид животно</h3>
            <form onSubmit={handleAddType} className="flex gap-2">
              <input
                type="text"
                placeholder="Вид животно (напр. Куче)"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Добави
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Добави порода</h3>
            <form onSubmit={handleAddBreed} className="flex gap-2">
              <select
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={newBreed.animalTypeId}
                onChange={(e) => setNewBreed({ ...newBreed, animalTypeId: e.target.value })}
                required
              >
                <option value="">Избери вид</option>
                {animalTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Порода (напр. Лабрадор)"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                value={newBreed.name}
                onChange={(e) => setNewBreed({ ...newBreed, name: e.target.value })}
                required
              />
              <button
                type="submit"
                className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
              >
                Добави
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-bold text-gray-700 mb-4">Видове и породи</h3>
            {animalTypes.map(t => (
              <div key={t.id} className="mb-4">
                <p className="font-medium text-orange-500">{t.name}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {t.breeds.length === 0 ? (
                    <span className="text-sm text-gray-400">Няма породи</span>
                  ) : (
                    t.breeds.map(b => (
                      <span key={b.id} className="bg-orange-50 text-orange-600 text-sm px-3 py-1 rounded-full">
                        {b.name}
                      </span>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}