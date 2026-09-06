import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Star, Zap, Users, CheckCircle, MessageSquarePlus } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ReviewModal from './ReviewModal';

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
      map.setView(position, map.getZoom() > 16 ? map.getZoom() : 18, {
        animate: true,
        duration: 0.5,
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
  isNavigating = false,
  userLocation = null,
  routeData = null,
  activeRouteLine = null,
  activePandal = null,
  liveCounts = {}
}) {
  const { lang, t } = useLanguage();
  const [reviewPandal, setReviewPandal] = useState(null);
  
  const liveCenter = [23.6183691, 88.1185789];
  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] : liveCenter;

  const planningPolyline = [
    liveCenter, 
    ...selectedRoute.map(p => [p.lat, p.lng]), 
    ...(selectedRoute.length > 0 ? [liveCenter] : [])
  ];

  const osrmPolyline = activeRouteLine 
    ? activeRouteLine.map(c => [c[1], c[0]])
    : routeData?.geometry?.coordinates?.map(c => [c[1], c[0]]) || [];

  const handleCheckIn = async (pandalId) => {
    const lastCheckIn = localStorage.getItem(`checkin_${pandalId}`);
    const now = Date.now();
    // 2 hours cooldown
    if (lastCheckIn && (now - parseInt(lastCheckIn)) < 2 * 60 * 60 * 1000) {
      alert('আপনি ইতিমধ্যে এই মণ্ডপে চেক-ইন করেছেন!');
      return;
    }

    try {
      await fetch(`http://localhost:5000/api/pandals/${pandalId}/checkin`, {
        method: 'POST'
      });
      localStorage.setItem(`checkin_${pandalId}`, now.toString());
      alert('চেক-ইন সফল হয়েছে!');
    } catch (err) {
      console.error(err);
      alert('চেক-ইন করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <>
      <MapContainer 
        center={mapCenter} 
        zoom={17} 
        maxZoom={19}
        zoomControl={!isNavigating}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
          maxNativeZoom={19}
          maxZoom={22}
        />
        
        <AutoCenterMap position={mapCenter} isNavigating={isNavigating} />

        <Marker 
          position={mapCenter} 
          icon={isNavigating ? getLivePulseIcon(userLocation?.heading || 0) : planningUserIcon}
          zIndexOffset={1000}
        >
          {!isNavigating && (
            <Popup>
              <div className="text-center font-bold text-gray-800">আপনার বর্তমান অবস্থান</div>
            </Popup>
          )}
        </Marker>

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

        {pandalsData.map((pandal) => {
          const isAdded = selectedRoute.some(p => p.id === pandal.id);
          const routeIndex = selectedRoute.findIndex(p => p.id === pandal.id);
          const count = liveCounts[pandal.id] || 0;

          return (
            <Marker 
              key={pandal.id} 
              position={[pandal.lat, pandal.lng]}
              icon={isAdded ? routeIcon : new L.Icon.Default()}
            >
              {!isNavigating && (
                <Popup className="custom-popup" minWidth={250}>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-[15px] m-0 leading-tight">
                          {isAdded && <span className="inline-block bg-blue-600 text-white rounded-full w-5 h-5 text-center text-xs leading-5 mr-1 font-sans">{routeIndex + 1}</span>}
                          {lang === 'en' ? pandal.name_en || pandal.name : pandal.name_bn || pandal.name}
                        </h3>
                        <div className="flex flex-col gap-1 mt-1">
                          <div className="flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" /> {pandal.zone}
                          </div>
                          {count > 0 && (
                            <div className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full w-max mt-1">
                              <Users className="w-3 h-3" /> Live: {count} জন
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-1">
                      <button 
                        onClick={() => handleCheckIn(pandal.id)}
                        className="bg-stone-100 hover:bg-green-50 hover:text-green-700 text-stone-700 border border-stone-200 py-1.5 rounded-md font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> চেক-ইন
                      </button>
                      <button 
                        onClick={() => setReviewPandal(pandal)}
                        className="bg-stone-100 hover:bg-amber-50 hover:text-amber-700 text-stone-700 border border-stone-200 py-1.5 rounded-md font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <MessageSquarePlus className="w-3.5 h-3.5" /> টিপস দিন
                      </button>
                    </div>

                    <div className="mt-1 pt-2 border-t border-gray-100">
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

      {reviewPandal && (
        <ReviewModal 
          pandalId={reviewPandal.id}
          pandalName={lang === 'en' ? reviewPandal.name_en || reviewPandal.name : reviewPandal.name_bn || reviewPandal.name}
          onClose={() => setReviewPandal(null)} 
        />
      )}
    </>
  );
}
