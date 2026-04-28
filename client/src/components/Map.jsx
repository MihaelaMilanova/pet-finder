import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Поправка за иконката на Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

export default function Map({ location }) {
  const [coords, setCoords] = useState(null)

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
        )
        const data = await res.json()
        if (data.length > 0) {
          setCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)])
        }
      } catch (err) {
        console.error(err)
      }
    }
    fetchCoords()
  }, [location])

  if (!coords) return <p className="text-gray-400 text-sm">Картата се зарежда...</p>

  return (
    <MapContainer center={coords} zoom={13} className="w-full h-48 rounded-xl z-0">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Marker position={coords}>
        <Popup>{location}</Popup>
      </Marker>
    </MapContainer>
  )
}