"use client";

import { APP_CONFIG } from '../config/appConfig';

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation, Star, Zap, Users, CheckCircle, MessageSquarePlus, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import ReviewModal from './ReviewModal';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { safeStorage } from '@/utils/storage';
import { haversineDistance } from '../utils/tspSolver';

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
function AutoCenterMap({ position, isNavigating, userLocation, selectedRoute }) {
  const map = useMap();
  const [isUserPanning, setIsUserPanning] = useState(false);

  useEffect(() => {
    const handlePanStart = () => setIsUserPanning(true);
    map.on('dragstart', handlePanStart);
    map.on('zoomstart', handlePanStart);
    
    return () => {
      map.off('dragstart', handlePanStart);
      map.off('zoomstart', handlePanStart);
    };
  }, [map]);

  useEffect(() => {
    if (isUserPanning) return; // Guard for fix 1

    if (isNavigating && position) {
      const zoom = map.getZoom() > 16 ? map.getZoom() : 18;
      
      // Calculate drawer height
      let drawerHeight = 220; // Fallback
      if (typeof document !== 'undefined') {
        const hudElement = document.getElementById('planner-drawer');
        if (hudElement) {
          drawerHeight = hudElement.getBoundingClientRect().height + 32;
        }
      }

      // Offset camera to keep user pin above the drawer
      const latLng = L.latLng(position[0], position[1]);
      const targetPoint = map.project(latLng, zoom);
      targetPoint.y += drawerHeight / 2;
      const offsetLatLng = map.unproject(targetPoint, zoom);

      map.setView(offsetLatLng, zoom, {
        animate: true,
        duration: 0.5,
      });
    } else if (selectedRoute && selectedRoute.length > 0) {
      const points = userLocation ? [{ lat: userLocation.lat, lng: userLocation.lng }, ...selectedRoute] : selectedRoute;
      const bounds = L.latLngBounds(points.map(p => [p.lat || p[0], p.lng || p[1]]));
      map.fitBounds(bounds, { padding: [50, 50], animate: true, duration: 0.5 });
    } else if (userLocation) {
      map.setView([userLocation?.lat, userLocation?.lng], 16, { animate: true });
    }
  }, [position, isNavigating, userLocation, selectedRoute, map, isUserPanning]);

  return isUserPanning && isNavigating ? (
    <div className="leaflet-bottom leaflet-right mb-72 mr-4 pointer-events-auto z-[1000]">
      <div className="leaflet-control leaflet-bar border-none shadow-xl rounded-full bg-white overflow-hidden">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsUserPanning(false);
          }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 pointer-events-auto"
          title="Re-centre"
        >
          <Navigation className="w-4 h-4" /> Re-centre
        </button>
      </div>
    </div>
  ) : null;
}

// Locate Me Component
function LocateMeButton({ userLocation }) {
  const map = useMap();
  
  if (!userLocation) return null;
  
  return (
    <div className="leaflet-bottom leaflet-right mb-24 mr-4 pointer-events-auto">
      <div className="leaflet-control leaflet-bar border-none shadow-xl rounded-full bg-white overflow-hidden">
        <button 
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            map.setView([userLocation.lat, userLocation.lng], 16, { animate: true });
          }}
          className="w-12 h-12 flex items-center justify-center bg-white text-blue-600 hover:bg-blue-50 transition-colors pointer-events-auto"
          title="Locate Me"
        >
          <Navigation className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

// Generate straight-line polyline for Haversine fallback
const generateHaversinePolyline = (origin, orderedPandals) => {
  const coords = [origin];
  orderedPandals.forEach(p => coords.push([p.lat, p.lng]));
  coords.push(origin); // Return to origin
  return coords;
};

export default function MapView({ 
  pandalsData = [], 
  selectedRoute = [], 
  onAddPandal, 
  onRemovePandal,
  isRouteMode,
  isNavigating = false,
  userLocation = null,
  routeData = null,
  activeRouteLine = null,
  activePandal = null,
  liveCounts = {}
}) {
  const userLat = userLocation?.lat;
  const userLng = userLocation?.lng;

  const { lang, t } = useLanguage();
  const [reviewPandal, setReviewPandal] = useState(null);
  const [osrmError, setOsrmError] = useState(false);
  const [haversinePolyline, setHaversinePolyline] = useState(null);
  
  const getMapCenterAndZoom = () => {
    if (userLocation) return { center: [userLocation.lat, userLocation.lng], zoom: 14 };
    if (!pandalsData || pandalsData.length === 0) return { center: [23.2324, 87.8615], zoom: 11 };
    
    let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
    pandalsData.forEach(p => {
      if (p.lat < minLat) minLat = p.lat;
      if (p.lat > maxLat) maxLat = p.lat;
      if (p.lng < minLng) minLng = p.lng;
      if (p.lng > maxLng) maxLng = p.lng;
    });
    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;
    return { center: [midLat, midLng], zoom: 12 };
  };

  const { center: mapCenter, zoom: mapZoom } = getMapCenterAndZoom();
  const liveCenter = mapCenter; // fallback reference for haversine origin

  let userCoordsForPolyline = [];
  if (userLocation && selectedRoute.length > 0) {
    userCoordsForPolyline = [[userLocation.lat, userLocation.lng]];
  }

  const planningPolyline = [
    ...userCoordsForPolyline, 
    ...selectedRoute.map(p => [p.lat, p.lng]), 
    ...(selectedRoute.length > 0 ? userCoordsForPolyline : [])
  ];

  const osrmPolyline = activeRouteLine 
    ? activeRouteLine.map(c => [c[1], c[0]])
    : routeData?.geometry?.coordinates?.map(c => [c[1], c[0]]) || [];

  // Generate Haversine fallback polyline when OSRM fails
  useEffect(() => {
    if (isNavigating && activePandal && selectedRoute.length > 0) {
      const origin = userLocation ? [userLocation.lat, userLocation.lng] : liveCenter;
      const remainingRoute = selectedRoute.slice(selectedRoute.findIndex(p => p.id === activePandal.id));
      setHaversinePolyline(generateHaversinePolyline(origin, remainingRoute));
    }
  }, [isNavigating, activePandal, selectedRoute, userLocation]);

  const handleCheckIn = useCallback(async (pandal) => {
    // Geofence check
    if (!userLocation) {
      alert('আপনার লাইভ লোকেশন পাওয়া যাচ্ছে না। দয়া করে GPS অন করুন।');
      return;
    }
    const distMeters = haversineDistance(userLocation, pandal) * 1000;
    if (distMeters > 120) {
      alert(`আপনি মণ্ডপ থেকে অনেক দূরে আছেন (${Math.round(distMeters)} মিটার)। ১২০ মিটারের মধ্যে এলে চেক-ইন করতে পারবেন।`);
      return;
    }

    const lastCheckIn = safeStorage.get(`last_checkin_${pandal.id}`);
    const now = Date.now();
    // 2 hours cooldown
    if (lastCheckIn && (now - parseInt(lastCheckIn)) < 2 * 60 * 60 * 1000) {
      alert('আপনি ইতিমধ্যে এই মণ্ডপে চেক-ইন করেছেন! ২ ঘণ্টা পর আবার চেষ্টা করুন।');
      return;
    }

    try {
      if (isSupabaseConfigured) {
        let visitorId = safeStorage.get('puja_visitor_id');
        if (!visitorId) {
          visitorId = crypto.randomUUID();
          safeStorage.set('puja_visitor_id', visitorId);
        }
        await supabase.from('pandal_visits').insert([{ pandal_id: String(pandal.id), user_uuid: visitorId }]);
      }
      safeStorage.set(`last_checkin_${pandal.id}`, now.toString());
      alert('চেক-ইন সফল হয়েছে!');
    } catch (err) {
      console.error(err);
      alert('চেক-ইন করতে সমস্যা হয়েছে।');
    }
  }, [userLocation]);

  // Determine which polyline to show during navigation
  const stablePosition = useMemo(() => {
    if (isNavigating && userLat && userLng) {
      return [userLat, userLng];
    }
    return null;
  }, [isNavigating, userLat, userLng]);

  return (
    <>
      <MapContainer 
        center={mapCenter} 
        zoom={mapZoom} 
        maxZoom={19}
        zoomControl={!isNavigating}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
      >
        <TileLayer
          url="https://puja-tiles-proxy.devsahatech.workers.dev/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
          maxNativeZoom={19}
          maxZoom={22}
        />
        
        <AutoCenterMap 
          position={stablePosition} 
          isNavigating={isNavigating} 
          userLocation={userLocation}
          selectedRoute={selectedRoute} 
        />
        <LocateMeButton userLocation={userLocation} />

        {userLocation && (
          <Marker 
            position={[userLocation.lat, userLocation.lng]} 
            icon={getLivePulseIcon(userLocation.heading || 0)}
            zIndexOffset={1000}
          >
            {!isNavigating && (
              <Popup>
                <div className="text-center font-bold text-gray-800">Your Location</div>
              </Popup>
            )}
          </Marker>
        )}

        {!isNavigating && selectedRoute.length > 0 && (
          <Polyline 
            positions={planningPolyline} 
            pathOptions={{ color: '#2563eb', weight: 4, opacity: 0.6, dashArray: '8, 8' }} 
          />
        )}

        {isNavigating && activePandal && (
          <>
            {/* OSRM Route (primary) */}
            {osrmPolyline.length > 0 && !osrmError && (
              <Polyline 
                positions={osrmPolyline} 
                pathOptions={{ color: '#4285F4', weight: 7, opacity: 0.9, lineCap: 'round', lineJoin: 'round' }} 
              />
            )}
            
            {/* Haversine Fallback removed per instructions */}
            {(osrmError || osrmPolyline.length === 0) && haversinePolyline && (
              <></>
            )}
            
            {/* Fallback indicator */}
            {osrmError && (
              <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                OSRM লিমিট পৌঁছেছে — সরাসরি রুট দেখানো হচ্ছে
              </div>
            )}
          </>
        )}

        {pandalsData.map((pandal) => {
          const isAdded = selectedRoute.some(p => p.id === pandal.id);
          const routeIndex = selectedRoute.findIndex(p => p.id === pandal.id);
          const count = liveCounts[pandal.id] || 0;
          const distMeters = userLocation ? haversineDistance(userLocation, pandal) * 1000 : Infinity;
          const checkInText = (distMeters >= 75 && distMeters <= 120) ? 'আমি মণ্ডপের কাছেই আছি (Check-in)' : 'চেক-ইন';

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
                              <Users className="w-3 h-3" /> ● {count} জন দর্শনার্থী উপস্থিত
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs mb-1">
                      <button 
                        onClick={() => handleCheckIn(pandal)}
                        className="bg-stone-100 hover:bg-green-50 hover:text-green-700 text-stone-700 border border-stone-200 py-1.5 rounded-md font-semibold flex items-center justify-center gap-1 transition-colors"
                      >
                        <CheckCircle className="w-3.5 h-3.5" /> {checkInText}
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
                        onClick={() => isAdded && onRemovePandal ? onRemovePandal(pandal.id) : onAddPandal(pandal)}
                        className={`w-full py-1.5 rounded-md font-bold text-sm flex items-center justify-center gap-1 transition-all ${
                          isAdded 
                            ? 'bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 shadow-sm' 
                            : 'bg-red-800 hover:bg-red-900 text-white shadow-sm'
                        }`}
                      >
                        {isAdded ? (lang === 'en' ? '- Remove from Route' : '- তালিকা থেকে বাদ দিন') : (lang === 'en' ? '+ Add to Route' : '+ তালিকায় যোগ করুন')}
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

