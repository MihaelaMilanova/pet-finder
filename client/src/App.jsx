import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Pets from './pages/Pets'
import PetDetails from './pages/PetDetails'
import CreatePet from './pages/CreatePet'
import Admin from './pages/Admin'
import MyPets from './pages/MyPets'
import Profile from './pages/Profile'
import NotFound from './pages/NotFound'
import Messages from './pages/Messages'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <main className="max-w-6xl mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/pets" element={<Pets />} />
            <Route path="/pets/:id" element={<PetDetails />} />
            <Route path="/create" element={<CreatePet />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/my-pets" element={<MyPets />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/messages" element={<Messages />} />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App