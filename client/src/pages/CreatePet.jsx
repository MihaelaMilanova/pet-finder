import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function CreatePet() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [animalTypes, setAnimalTypes] = useState([])
  const [breeds, setBreeds] = useState([])
  const [error, setError] = useState('')
  const [imageFile, setImageFile] = useState(null)
const [imagePreview, setImagePreview] = useState(null)
const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'LOST',
    color: '',
    age: '',
    imageUrl: '',
    location: '',
    animalTypeId: '',
    breedId: '',
  })

  useEffect(() => {
    if (!user) navigate('/login')
  }, [user])

  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const res = await api.get('/animal-types')
        setAnimalTypes(res.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchTypes()
  }, [])

  useEffect(() => {
    if (form.animalTypeId) {
      const type = animalTypes.find(t => t.id === parseInt(form.animalTypeId))
      setBreeds(type?.breeds || [])
    } else {
      setBreeds([])
    }
  }, [form.animalTypeId, animalTypes])

  const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    let imageUrl = form.imageUrl

    if (imageFile) {
      setUploading(true)
      const formData = new FormData()
      formData.append('image', imageFile)
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      imageUrl = uploadRes.data.url
      setUploading(false)
    }

    const res = await api.post('/pets', { ...form, imageUrl })
    navigate(`/pets/${res.data.id}`)
  } catch (err) {
    setUploading(false)
    setError(err.response?.data?.error || 'Грешка при създаване на обява')
  }
}

  return (
    <div className="max-w-xl mx-auto mt-8 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-orange-500 mb-6 text-center">Добави обява</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Заглавие"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <textarea
          placeholder="Описание"
          rows={3}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
        />

        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="LOST">Изгубен</option>
          <option value="FOUND">Намерен</option>
        </select>

        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.animalTypeId}
          onChange={(e) => setForm({ ...form, animalTypeId: e.target.value, breedId: '' })}
          required
        >
          <option value="">Вид животно</option>
          {animalTypes.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        {breeds.length > 0 && (
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={form.breedId}
            onChange={(e) => setForm({ ...form, breedId: e.target.value })}
          >
            <option value="">Порода (незадължително)</option>
            {breeds.map(b => (
              <option key={b.id} value={b.id}>{b.name}</option>
            ))}
          </select>
        )}

        <input
          type="text"
          placeholder="Цвят"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.color}
          onChange={(e) => setForm({ ...form, color: e.target.value })}
          required
        />

        <input
          type="number"
          placeholder="Възраст (незадължително)"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />

        <input
          type="text"
          placeholder="Местоположение"
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />

        <div className="border border-gray-300 rounded-lg p-4">
  <label className="block text-sm text-gray-500 mb-2">Снимка</label>
  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
  const file = e.target.files?.[0]
  if (file) {
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }
}}
    className="w-full text-sm text-gray-500"
  />
  {imagePreview && (
    <img src={imagePreview} alt="Preview" className="mt-3 w-full h-40 object-cover rounded-lg" />
  )}
</div>

        <button
  type="submit"
  disabled={uploading}
  className="bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition font-semibold disabled:opacity-50"
>
  {uploading ? 'Качва се снимката...' : 'Публикувай обява'}
</button>
      </form>
    </div>
  )
}