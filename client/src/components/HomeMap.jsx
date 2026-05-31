import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../api/axios'

// Персонализирани икони по статус
const icons = {
  LOST: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  }),
  FOUND: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  }),
  HOME: new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34],
  }),
}

const statusLabels = {
  LOST: 'Изгубен',
  FOUND: 'Намерен',
  HOME: 'У дома',
}

export default function HomeMap() {
  const [markers, setMarkers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAndGeocode = async () => {
      try {
        const res = await api.get('/pets')
        const pets = res.data

        // Геокодиране на всички локации
        const results = await Promise.all(
          pets.map(async (pet) => {
            try {
              const geoRes = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(pet.location)}&format=json&limit=1`
              )
              const geoData = await geoRes.json()
              if (geoData.length > 0) {
                return {
                  ...pet,
                  lat: parseFloat(geoData[0].lat),
                  lon: parseFloat(geoData[0].lon),
                }
              }
            } catch {
              return null
            }
            return null
          })
        )

        setMarkers(results.filter(Boolean))
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchAndGeocode()
  }, [])

  if (loading) return (
    <div className="w-full h-96 bg-orange-50 rounded-xl flex items-center justify-center">
      <p className="text-gray-400">Картата се зарежда...</p>
    </div>
  )

  return (
    <div className="mb-16">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">🗺️ Обяви на картата</h2>
      <div className="flex gap-4 mb-3 text-sm">
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span> Изгубен</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span> Намерен</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 bg-orange-500 rounded-full inline-block"></span> У дома</span>
      </div>
      <MapContainer
        center={[42.7, 25.5]}
        zoom={7}
        className="w-full rounded-xl z-0"
        style={{ height: '450px' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {markers.map(pet => (
          <Marker
            key={pet.id}
            position={[pet.lat, pet.lon]}
            icon={icons[pet.status]}
          >
            <Popup>
              <div className="text-sm">
                {pet.imageUrl && (
                  <img src={pet.imageUrl} alt={pet.title} className="w-full h-24 object-cover rounded mb-2" />
                )}
                <p className="font-bold">{pet.title}</p>
                <p className="text-gray-500">{statusLabels[pet.status]} • {pet.location}</p>
                {pet.animalType && <p className="text-gray-500">{pet.animalType.name}</p>}
                
                 <a href={`/pets/${pet.id}`}
                  className="text-orange-500 hover:underline mt-1 block"
                >
                  Виж обявата →
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  )
}