import React, { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MapPin, Award, ExternalLink } from 'lucide-react';
import { formatHeritageLocation } from '../../utils/formatLocation';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in React-Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on ranking
const createCustomIcon = (rankingType) => {
  const colors = {
    'Quốc gia đặc biệt': '#b91c1c',
    'Quốc gia': '#f59e0b',
    'Cấp tỉnh': '#22c55e',
    'default': '#6b7280',
  };

  const color = colors[rankingType] || colors.default;
  
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        background: ${color};
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

// Map center controller
function MapController({ center, zoom }) {
  const map = useMap();
  
  React.useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
}

// Heritage popup component
function HeritagePopup({ heritage }) {
  const { t } = useTranslation();
  const rankingColors = {
    'Quốc gia đặc biệt': 'bg-heritage-red-600 text-white',
    'Quốc gia': 'bg-heritage-gold-500 text-heritage-red-900',
    'Cấp tỉnh': 'bg-green-600 text-white',
  };

  const ranking = heritage.rankingType || heritage.ranking || 'Di sản';

  return (
    <div className="min-w-[250px] max-w-[300px]">
      {heritage.image && (
        <img
          src={heritage.image}
          alt={heritage.name}
          className="w-full h-32 object-cover rounded-t-lg"
        />
      )}
      <div className="p-3">
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium mb-2 ${rankingColors[ranking] || 'bg-gray-600 text-white'}`}>
          <Award className="w-3 h-3" />
          {ranking}
        </div>
        
        <h3 className="font-bold text-gray-900 mb-1 line-clamp-2">
          {heritage.name}
        </h3>
        
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-3 h-3" />
          <span>{formatHeritageLocation(heritage, t)}</span>
        </div>
        
        <Link
          to={`/heritage/${heritage.id}`}
          className="inline-flex items-center gap-1 text-heritage-red-600 hover:text-heritage-red-700 text-sm font-medium"
        >
          Xem chi tiết
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}

export default function InteractiveMap({
  heritages = [],
  center = [9.1766, 105.1500],
  zoom = 10,
  onMarkerClick = null,
  height = '100%'
}) {
  const [mapCenter] = useState(center);
  const [mapZoom] = useState(zoom);

  // Deterministic fallback coordinates near Ca Mau when lat/lng missing (seed from id)
  const heritagesWithCoords = useMemo(() => {
    return heritages.map((h) => {
      const id = h.id || 0;
      const seedLat = ((id % 100) / 100 - 0.5) * 0.8;
      const seedLng = (((id * 7) % 100) / 100 - 0.5) * 0.8;
      return {
        ...h,
        lat: h.lat || 9.1766 + seedLat,
        lng: h.lng || 105.1500 + seedLng,
      };
    });
  }, [heritages]);

  return (
    <div style={{ height }} className="rounded-2xl overflow-hidden shadow-xl">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController center={mapCenter} zoom={mapZoom} />
        
        {heritagesWithCoords.map((heritage) => (
          <Marker
            key={heritage.id}
            position={[heritage.lat, heritage.lng]}
            icon={createCustomIcon(heritage.rankingType || heritage.ranking)}
            eventHandlers={{
              click: () => {
                if (onMarkerClick) onMarkerClick(heritage);
              },
            }}
          >
            <Popup>
              <HeritagePopup heritage={heritage} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

