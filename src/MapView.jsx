import React from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix for default marker icons in Leaflet with React
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
})

L.Marker.prototype.options.icon = DefaultIcon

const MapView = ({ restaurants, selectedAllergies }) => {
    // Center of restaurants for demo
    const center = [37.5665, 126.9780] // Seoul City Hall as default

    return (
        <div className="map-container">
            <MapContainer center={center} zoom={14} scrollWheelZoom={false}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {restaurants.map(res => (
                    <Marker key={res.id} position={res.position}>
                        <Popup>
                            <strong>{res.name}</strong><br />
                            {res.type}<br />
                            {res.safeFor.filter(a => selectedAllergies.includes(a)).length > 0 ? '✅ 안심 메뉴 있음' : '❌ 매칭되는 안심 메뉴 없음'}
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    )
}

export default MapView
