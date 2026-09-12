"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import * as turf from '@turf/turf';
import { fetchOSRMRoute, parseManeuver, snapToRoute, clearRouteCache } from '../utils/navigationEngine';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export function useLiveNavigator(optimizedRoute, lang, t) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [routeData, setRouteData] = useState(null); // Full original OSRM route
  const [activeRouteLine, setActiveRouteLine] = useState(null); // Sliced line for rendering
  const [currentManeuver, setCurrentManeuver] = useState(null);
  const [distanceToTarget, setDistanceToTarget] = useState(null);
  const [isVoiceMuted, setIsVoiceMutedState] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [osrmError, setOsrmError] = useState(false);
  const [gpsPermissionDenied, setGpsPermissionDenied] = useState(false);

  const isVoiceMutedRef = useRef(false);
  const setIsVoiceMuted = (val) => {
    setIsVoiceMutedState(val);
    isVoiceMutedRef.current = val;
    if (val && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Instantly stop talking if muted
      setIsSpeaking(false);
    }
  };

  const wakeLockRef = useRef(null);
  const watchIdRef = useRef(null);
  const lastSpokenManeuverRef = useRef('');
  const socketRef = useRef(null);
  const pollingIntervalRef = useRef(null);
  const liveCountsRef = useRef({});
  const lastOsrmFailTimeRef = useRef(0);
  const consecutiveArrivalsRef = useRef(0);

  const activePandal = optimizedRoute[currentStopIndex] || null;

  // Polling fallback for live visitor counts
  useEffect(() => {
    const pollCounts = async () => {
      try {
        if (isSupabaseConfigured) {
          const since = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
          const { data, error } = await supabase
            .from('pandal_visits')
            .select('pandal_id')
            .gte('visited_at', since);
            
          if (!error && data) {
            const counts = {};
            data.forEach(row => {
              counts[row.pandal_id] = (counts[row.pandal_id] || 0) + 1;
            });
            liveCountsRef.current = counts;
          }
        }
      } catch (err) {
        console.warn('Polling failed:', err);
      }
    };

    // Initial poll
    pollCounts();
    
    // Poll every 60 seconds
    pollingIntervalRef.current = setInterval(pollCounts, 60000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // Speak Bengali Function
  const speakPrompt = useCallback((text) => {
    if (isVoiceMutedRef.current || typeof window === 'undefined' || !window.speechSynthesis) return;
    
    // Debounce exact same phrases to prevent spam
    if (lastSpokenManeuverRef.current === text) return;

    window.speechSynthesis.cancel(); // cancel previous
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (lang === 'en') {
      utterance.lang = 'en-IN';
      utterance.rate = 0.9; 
      utterance.pitch = 1.0; 
    } else {
      utterance.lang = 'bn-IN';
      utterance.rate = 0.8; // Slower for clarity
      utterance.pitch = 0.8; // Slightly deeper, less robotic
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    
    lastSpokenManeuverRef.current = text;
    
    // Clear debounce after 15 seconds
    setTimeout(() => {
      lastSpokenManeuverRef.current = '';
    }, 15000);
  }, [lang]);

  // Request Wake Lock
  const requestWakeLock = async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLockRef.current = await navigator.wakeLock.request('screen');
      }
    } catch (err) {
      console.warn('Wake Lock error:', err);
    }
  };

  const releaseWakeLock = () => {
    if (wakeLockRef.current !== null) {
      wakeLockRef.current.release();
      wakeLockRef.current = null;
    }
  };

  const startTour = () => {
    if (optimizedRoute.length === 0) return;
    if (gpsPermissionDenied || !userLocation) {
      console.warn('Cannot start live navigation: GPS denied or user location unavailable.');
      return;
    }
    setIsNavigating(true);
    setCurrentStopIndex(0);
    setOsrmError(false);
    requestWakeLock();

    // Silent utterance to unlock iOS/browser speech restrictions
    if (window.speechSynthesis) {
      const silent = new SpeechSynthesisUtterance('');
      window.speechSynthesis.speak(silent);
    }

    speakPrompt(t('start_tour'));
  };

  const endTour = () => {
    setIsNavigating(false);
    setRouteData(null);
    setCurrentManeuver(null);
    setOsrmError(false);
    releaseWakeLock();
    if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    speakPrompt(t('tour_complete'));
  };

  const getPandalName = (pandal) => {
    if (!pandal) return '';
    return lang === 'en' ? pandal.name_en || pandal.name : pandal.name_bn || pandal.name;
  };

  const skipToNext = () => {
    if (currentStopIndex < optimizedRoute.length - 1) {
      setCurrentStopIndex(prev => prev + 1);
      const nextPandalName = getPandalName(optimizedRoute[currentStopIndex + 1]);
      speakPrompt(`${t('skip')} ${nextPandalName}`);
    } else {
      endTour();
    }
  };

  const routeDataRef  = useRef(null);
  const isFetchingRef  = useRef(false); // prevent parallel OSRM calls

  // Sync routeData state → ref so async callbacks always read latest value
  useEffect(() => {
    routeDataRef.current = routeData;
  }, [routeData]);

  // Setup GPS Watcher and Route Fetching
  useEffect(() => {
    if (!isNavigating || !activePandal) return;

    const success = async (position) => {
      // 1. Ignore inaccurate GPS readings (Bounce Protection)
      if (position.coords.accuracy && position.coords.accuracy > 50) {
        console.warn('GPS reading ignored due to low accuracy:', position.coords.accuracy);
        return;
      }

      const rawLat = position.coords.latitude;
      const rawLng = position.coords.longitude;
      const heading = position.coords.heading || 0;

      const rawUserPoint = turf.point([rawLng, rawLat]);
      const targetPoint = turf.point([activePandal.lng, activePandal.lat]);
      
      const distKm = turf.distance(rawUserPoint, targetPoint);
      const distMeters = Math.round(distKm * 1000);
      setDistanceToTarget(distMeters);

      // 2. Ghost Arrival Protection (<= 35m for 2 consecutive ticks)
      if (distMeters <= 35) {
        consecutiveArrivalsRef.current += 1;
        if (consecutiveArrivalsRef.current >= 2) {
          speakPrompt(t('arrive', { name: getPandalName(activePandal) }));
          consecutiveArrivalsRef.current = 0; // reset
          return;
        }
      } else {
        consecutiveArrivalsRef.current = 0;
      }

      // Fetch OSRM route once — use ref lock to prevent parallel calls
      let currentRouteData = routeDataRef.current;

      if (!currentRouteData && !isFetchingRef.current) {
        // 3. OSRM Rate Limit 30-Second Backoff
        if (Date.now() - lastOsrmFailTimeRef.current < 30000) {
          setOsrmError(true);
        } else {
          isFetchingRef.current = true;
          const route = await fetchOSRMRoute([rawLng, rawLat], [activePandal.lng, activePandal.lat]);
          isFetchingRef.current = false;
          
          if (route) {
            setRouteData(route);
            currentRouteData = route;
            routeDataRef.current = route; // update ref immediately
            setOsrmError(false);
            if (route.legs && route.legs[0].steps.length > 0) {
              const step = route.legs[0].steps[0];
              const parsed = parseManeuver(step, t);
              setCurrentManeuver(parsed);
              speakPrompt(parsed.text);
            }
          } else {
            // OSRM failed (likely 429 rate limit)
            setOsrmError(true);
            lastOsrmFailTimeRef.current = Date.now();
          }
        }
      }

      // Snap location & Slice Line & Detect Off-Route
      if (currentRouteData && currentRouteData.geometry) {
        try {
           const line = turf.lineString(currentRouteData.geometry.coordinates);
           const rawPoint = turf.point([rawLng, rawLat]);
           const snappedPoint = turf.nearestPointOnLine(line, rawPoint);
           const snappedCoords = snappedPoint.geometry.coordinates; // [lng, lat]
           
           // 1. Off-Route Detection (if > 40 meters from snapped point)
           const distFromRoute = turf.distance(rawPoint, snappedPoint) * 1000;
           if (distFromRoute > 40 && !isFetchingRef.current) {
             console.warn('Off-route detected:', distFromRoute, 'meters');
             clearRouteCache();
             setRouteData(null);
             routeDataRef.current = null;
             return; // Skip rest, next GPS tick will fetch fresh route!
           }

           // 2. Slice line from current location to target
           const targetPoint = turf.point([activePandal.lng, activePandal.lat]);
           const slicedLine = turf.lineSlice(snappedPoint, targetPoint, line);
           setActiveRouteLine(slicedLine.geometry.coordinates);

           setUserLocation({ lat: snappedCoords[1], lng: snappedCoords[0], heading });
        } catch(e) {
           console.error('Turf slicing error:', e);
           setUserLocation({ lat: rawLat, lng: rawLng, heading });
        }
      } else {
        setUserLocation({ lat: rawLat, lng: rawLng, heading });
      }
    };

    const error = (err) => {
      console.warn('GPS Error:', err);
      setGpsPermissionDenied(true);
      if (optimizedRoute && optimizedRoute.length > 0) {
        success({
          coords: { latitude: optimizedRoute[0].lat, longitude: optimizedRoute[0].lng, heading: 0, accuracy: 10 }
        });
      }
    };

    watchIdRef.current = navigator.geolocation.watchPosition(success, error, {
      enableHighAccuracy: true,
      maximumAge: 2000,
      timeout: 8000
    });

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
      isFetchingRef.current = false;
    };
  }, [isNavigating, activePandal]);

  // Clear route cache when target pandal changes so a fresh route is fetched
  useEffect(() => {
    if (activePandal) {
      setRouteData(null);
      setActiveRouteLine(null);
      routeDataRef.current  = null;
      isFetchingRef.current = false;
      setOsrmError(false);
      clearRouteCache();
    }
  }, [activePandal?.id]);
  useEffect(() => {
    setRouteData(null);
    setCurrentManeuver(null);
  }, [currentStopIndex]);

  return {
    isNavigating,
    currentStopIndex,
    activePandal,
    currentManeuver,
    userLocation,
    distanceToTarget,
    routeData,
    activeRouteLine,
    startTour,
    endTour,
    skipToNext,
    isVoiceMuted,
    setIsVoiceMuted,
    isSpeaking,
    osrmError,
    gpsPermissionDenied,
    liveCounts: liveCountsRef.current
  };
}