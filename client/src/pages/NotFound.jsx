import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="text-center py-24">
      <div className="text-8xl mb-6">🐾</div>
      <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
      <p className="text-xl text-gray-500 mb-8">Страницата не беше намерена</p>
      <Link
        to="/"
        className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-orange-600 transition"
      >
        Към началото
      </Link>
    </div>
  )
}