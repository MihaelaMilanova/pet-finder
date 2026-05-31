import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const [passwordStrength, setPasswordStrength] = useState({
  length: false,
  uppercase: false,
  number: false,
})

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/auth/register', form)
      login(res.data.token, res.data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Грешка при регистрация')
    }
  }

  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-stone-700 mb-6 text-center">Регистрация</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Име"
          className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-600"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Имейл"
          className="border border-stone-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-600"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <div>
  <input
    type="password"
    placeholder="Парола"
    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
    value={form.password}
    onChange={(e) => {
      const val = e.target.value
      setForm({ ...form, password: val })
      setPasswordStrength({
        length: val.length >= 8,
        uppercase: /[A-Z]/.test(val),
        number: /[0-9]/.test(val),
      })
    }}
    required
  />
  {form.password && (
    <div className="mt-2 flex flex-col gap-1 text-xs">
      <span className={passwordStrength.length ? 'text-green-500' : 'text-red-400'}>
        {passwordStrength.length ? '✓' : '✗'} Поне 8 знака
      </span>
      <span className={passwordStrength.uppercase ? 'text-green-500' : 'text-red-400'}>
        {passwordStrength.uppercase ? '✓' : '✗'} Поне една главна буква
      </span>
      <span className={passwordStrength.number ? 'text-green-500' : 'text-red-400'}>
        {passwordStrength.number ? '✓' : '✗'} Поне една цифра
      </span>
    </div>
  )}
</div>
        <button
          type="submit"
          className="bg-amber-700 text-white py-2 rounded-lg hover:bg-amber-800 transition font-semibold"
        >
          Регистрация
        </button>
      </form>
      <p className="text-center text-stone-500 mt-4">
        Вече имаш акаунт?{' '}
        <Link to="/login" className="text-amber-700 hover:underline">Влез</Link>
      </p>
    </div>
  )
}