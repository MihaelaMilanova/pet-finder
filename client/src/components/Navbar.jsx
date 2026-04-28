import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-orange-500 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold">🐾 PetFinder</Link>
      <div className="flex gap-4 items-center">
        <Link to="/pets" className="hover:underline">Обяви</Link>
        {user ? (
          <>
            <Link to="/create" className="hover:underline">Добави обява</Link>
            <Link to="/my-pets" className="hover:underline">Моите обяви</Link>
            <Link to="/messages" className="hover:underline">Съобщения</Link>
            {user.role === 'ADMIN' && (
              <Link to="/admin" className="hover:underline">Админ</Link>
            )}
            <Link to="/profile" className="text-sm opacity-80 hover:underline">
                Здравей, {user.name}!
            </Link>
            <button onClick={handleLogout} className="bg-white text-orange-500 px-3 py-1 rounded hover:bg-orange-100">
              Изход
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Вход</Link>
            <Link to="/register" className="bg-white text-orange-500 px-3 py-1 rounded hover:bg-orange-100">
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}