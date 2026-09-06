"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import * as turf from '@turf/turf';
import { fetchOSRMRoute, parseManeuver, snapToRoute, clearRouteCache } from '../utils/navigationEngine';

export function useLiveNavigator(optimizedRoute, lang, t) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [routeData, setRouteData] = useState(null); // The OSRM route object
  const [currentManeuver, setCurrentManeuver] = useState(null);
  const [distanceToTarget, setDistanceToTarget] = useState(null);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const wakeLockRef = useRef(null);
  const watchIdRef = useRef(null);
  const lastSpokenManeuverRef = useRef('');

  const activePandal = optimizedRoute[currentStopIndex] || null;

  // Speak Bengali Function
  const speakPrompt = useCallback((text) => {
    if (isVoiceMuted || typeof window === 'undefined' || !window.speechSynthesis) return;
    
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
  }, [isVoiceMuted]);

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
    setIsNavigating(true);
    setCurrentStopIndex(0);
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
      const rawLat = position.coords.latitude;
      const rawLng = position.coords.longitude;
      const heading = position.coords.heading || 0;

      const rawUserPoint = turf.point([rawLng, rawLat]);
      const targetPoint = turf.point([activePandal.lng, activePandal.lat]);
      
      const distKm = turf.distance(rawUserPoint, targetPoint);
      const distMeters = Math.round(distKm * 1000);
      setDistanceToTarget(distMeters);

      if (distMeters <= 30) {
        speakPrompt(t('arrive', { name: getPandalName(activePandal) }));
        return;
      }

      // Fetch OSRM route once — use ref lock to prevent parallel calls
      let currentRouteData = routeDataRef.current;

      if (!currentRouteData && !isFetchingRef.current) {
        isFetchingRef.current = true;
        const route = await fetchOSRMRoute([rawLng, rawLat], [activePandal.lng, activePandal.lat]);
        isFetchingRef.current = false;
        if (route) {
          setRouteData(route);
          currentRouteData = route;
          routeDataRef.current = route; // update ref immediately
          if (route.legs && route.legs[0].steps.length > 0) {
            const step = route.legs[0].steps[0];
            const parsed = parseManeuver(step, t);
            setCurrentManeuver(parsed);
            speakPrompt(parsed.text);
          }
        }
      }

      // Snap location
      if (currentRouteData && currentRouteData.geometry) {
        try {
           const line = turf.lineString(currentRouteData.geometry.coordinates);
           const snappedCoords = snapToRoute([rawLat, rawLng], line);
           setUserLocation({ lat: snappedCoords[0], lng: snappedCoords[1], heading });
        } catch(e) {
           setUserLocation({ lat: rawLat, lng: rawLng, heading });
        }
      } else {
        setUserLocation({ lat: rawLat, lng: rawLng, heading });
      }
    };

    const error = (err) => {
      console.warn('GPS Error:', err);
      // GPS denied — use Bardhaman town centre as dummy location so OSRM can fetch
      success({
        coords: { latitude: 23.6183691, longitude: 88.1185789, heading: 45 }
      });
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
      routeDataRef.current  = null;
      isFetchingRef.current = false;
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
    startTour,
    endTour,
    skipToNext,
    isVoiceMuted,
    setIsVoiceMuted,
    isSpeaking
  };
}
