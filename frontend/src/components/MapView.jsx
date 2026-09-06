import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Star, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

// Fix for default Leaflet icon paths in Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Red Icon for Planning Phase Location
const planningUserIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Pulse effect for Live Navigation GPS Location (with directional arrow)
const getLivePulseIcon = (heading = 0) => L.divIcon({
  className: 'live-pulse-marker',
  html: `<div class="relative flex items-center justify-center w-24 h-24" style="transform: rotate(${heading}deg); transition: transform 0.5s ease-out;">
           <!-- Directional Cone (Google Maps Style) -->
           <div class="absolute w-24 h-24 bg-gradient-to-t from-blue-500/0 via-blue-400/20 to-blue-400/60 rounded-full" style="clip-path: polygon(50% 50%, 15% 0%, 85% 0%);"></div>
           <!-- Center Dot (Google Maps Style) -->
           <div class="relative w-5 h-5 bg-[#4285F4] rounded-full border-[3.5px] border-white shadow-[0_0_8px_rgba(0,0,0,0.4)] z-10"></div>
         </div>`,
  iconSize: [96, 96],
  iconAnchor: [48, 48]
});

const routeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Auto-Pan Component
function AutoCenterMap({ position, isNavigating }) {
  const map = useMap();
  
  useEffect(() => {
    if (isNavigating && position) {
      map.flyTo(position, 18, {
        animate: true,
        duration: 1.5, // smooth pan
      });
    }
  }, [position, isNavigating, map]);

  return null;
}

export default function MapView({ 
  pandalsData = [], 
  selectedRoute = [], 
  onAddPandal, 
  isRouteMode,
  // Live Nav Props
  isNavigating = false,
  userLocation = null,
  routeData = null,
  activePandal = null
}) {
  const { lang, t } = useLanguage();
  
  const liveCenter = [23.6183691, 88.1185789];

  // For planning phase, user location is static center, unless we have real GPS
  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : liveCenter;

  // Extract straight lines for Planning Mode
  const planningPolyline = [
    liveCenter, 
    ...selectedRoute.map(p => [p.lat, p.lng]), 
    ...(selectedRoute.length > 0 ? [liveCenter] : []) // Returns to start!
  ];

  // Extract OSRM snapped geometry for Live Navigation Mode
  const osrmPolyline = routeData?.geometry?.coordinates?.map(c => [c[1], c[0]]) || [];

  return (
    <MapContainer 
      center={mapCenter} 
      zoom={17} 
      maxZoom={19}
      zoomControl={!isNavigating} // hide zoom controls during live nav for cleaner HUD
      style={{ height: '100%', width: '100%' }}
      className="z-0"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        maxZoom={19}
      />
      
      {/* Auto Pan Hook */}
      <AutoCenterMap position={mapCenter} isNavigating={isNavigating} />

      {/* User Location Marker */}
      <Marker 
        position={mapCenter} 
        icon={isNavigating ? getLivePulseIcon(userLocation?.heading || 0) : planningUserIcon}
        zIndexOffset={1000} // keep user on top
      >
        {!isNavigating && (
          <Popup>
            <div className="text-center font-bold text-gray-800">আপনার বর্তমান অবস্থান</div>
          </Popup>
        )}
      </Marker>

      {/* Route Lines */}
      {!isNavigating && selectedRoute.length > 0 && (
        <Polyline 
          positions={planningPolyline} 
          pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.6, dashArray: '8, 8' }} 
        />
      )}

      {isNavigating && activePandal && (
        <Polyline 
          positions={osrmPolyline.length > 0 ? osrmPolyline : [mapCenter, [activePandal.lat, activePandal.lng]]} 
          pathOptions={{ color: '#4285F4', weight: 7, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }} 
        />
      )}

      {/* Pandal Markers */}
      {pandalsData.map((pandal) => {
        const isAdded = selectedRoute.some(p => p.id === pandal.id);
        const routeIndex = selectedRoute.findIndex(p => p.id === pandal.id);

        return (
          <Marker 
            key={pandal.id} 
            position={[pandal.lat, pandal.lng]}
            icon={isAdded ? routeIcon : new L.Icon.Default()}
          >
            {/* Disable popups completely during live navigation */}
            {!isNavigating && (
              <Popup className="custom-popup" minWidth={250}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 text-[15px] m-0 leading-tight">
                        {isAdded && <span className="inline-block bg-blue-600 text-white rounded-full w-5 h-5 text-center text-xs leading-5 mr-1 font-sans">{routeIndex + 1}</span>}
                        {lang === 'en' ? pandal.name_en || pandal.name : pandal.name_bn || pandal.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <MapPin className="w-3 h-3" />
                        {pandal.zone}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-gray-700">Theme:</span>
                      <span className="text-amber-600 font-medium">{pandal.theme}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="font-bold text-gray-800">{pandal.rating}</span>
                    </div>
                  </div>

                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <button 
                      onClick={() => onAddPandal(pandal)}
                      disabled={isAdded}
                      className={`w-full py-1.5 rounded-md font-bold text-sm flex items-center justify-center gap-1 transition-all ${
                        isAdded 
                          ? 'bg-green-100 text-green-700 border border-green-200 cursor-default' 
                          : 'bg-red-800 hover:bg-red-900 text-white shadow-sm'
                      }`}
                    >
                      {isAdded ? t('added') : t('add_to_route')}
                    </button>
                  </div>
                </div>
              </Popup>
            )}
          </Marker>
        );
      })}

    </MapContainer>
  );
}
