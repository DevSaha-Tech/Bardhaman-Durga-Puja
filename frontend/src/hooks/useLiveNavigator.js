"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { useGeolocation } from './useGeolocation';
import * as turf from '@turf/turf';
import { fetchOSRMRoute, parseManeuver, snapToRoute, clearRouteCache } from '../utils/navigationEngine';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { APP_CONFIG } from '../config/appConfig';
import { useVoice } from './useVoice';

export function useLiveNavigator(optimizedRoute, lang, t) {
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const { position: userLocation } = useGeolocation({ mode: 'watch' });
  const [routeData, setRouteData] = useState(null); // Full original OSRM route
  const [activeRouteLine, setActiveRouteLine] = useState(null); // Sliced line for rendering
  const [currentManeuver, setCurrentManeuver] = useState(null);
  const [distanceToTarget, setDistanceToTarget] = useState(null);
  const [osrmError, setOsrmError] = useState(false);
  const [gpsPermissionDenied, setGpsPermissionDenied] = useState(false);

  const { speak: speakPrompt, isVoiceMuted, setIsVoiceMuted, isSpeaking } = useVoice({ lang });

  const wakeLockRef = useRef(null);
  const watchIdRef = useRef(null);
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

    pollCounts();
    
    pollingIntervalRef.current = setInterval(pollCounts, 60000);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

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
  const isFetchingRef  = useRef(false);

  useEffect(() => {
    routeDataRef.current = routeData;
  }, [routeData]);

  // Setup GPS Watcher and Route Fetching
  useEffect(() => {
    if (!isNavigating || !activePandal || !userLocation) return;
    const processGPS = async () => {
      // 1. Ignore inaccurate GPS readings (Bounce Protection)
      if (userLocation.accuracy && userLocation.accuracy > 50) {
        console.warn('GPS reading ignored due to low accuracy:', userLocation.accuracy);
        return;
      }

      const rawLat = userLocation.lat;
      const rawLng = userLocation.lng;
      const heading = userLocation.heading || 0;

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
          consecutiveArrivalsRef.current = 0;
          return;
        }
      } else {
        consecutiveArrivalsRef.current = 0;
      }

      // Fetch OSRM route once
      let currentRouteData = routeDataRef.current;

      if (!currentRouteData && !isFetchingRef.current) {
        if (Date.now() - lastOsrmFailTimeRef.current < 30000) {
          setOsrmError(true);
        } else {
          isFetchingRef.current = true;
          const route = await fetchOSRMRoute([rawLng, rawLat], [activePandal.lng, activePandal.lat]);
          isFetchingRef.current = false;
          
          if (route) {
            setRouteData(route);
            currentRouteData = route;
            routeDataRef.current = route;
            setOsrmError(false);
            if (route.legs && route.legs[0].steps.length > 0) {
              const step = route.legs[0].steps[0];
              const parsed = parseManeuver(step, t);
              setCurrentManeuver(parsed);
            }
          } else {
            setOsrmError(true);
            lastOsrmFailTimeRef.current = Date.now();
          }
        }
      }

      if (currentRouteData && currentRouteData.geometry) {
        try {
           const line = turf.lineString(currentRouteData.geometry.coordinates);
           const rawPoint = turf.point([rawLng, rawLat]);
           const snappedPoint = turf.nearestPointOnLine(line, rawPoint);
           const snappedCoords = snappedPoint.geometry.coordinates;
           
           const distFromRoute = turf.distance(rawPoint, snappedPoint) * 1000;
           if (distFromRoute > 40 && !isFetchingRef.current) {
             console.warn('Off-route detected:', distFromRoute, 'meters');
             clearRouteCache();
             setRouteData(null);
             routeDataRef.current = null;
             return;
           }

           const targetPoint = turf.point([activePandal.lng, activePandal.lat]);
           const slicedLine = turf.lineSlice(snappedPoint, targetPoint, line);
           setActiveRouteLine(slicedLine.geometry.coordinates);
        } catch(e) {
           console.error('Turf slicing error:', e);
        }
      }
    };
    processGPS();
  }, [userLocation, isNavigating, activePandal]);

  // Clear route cache when target pandal changes
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

  const speedKmH = APP_CONFIG.speeds[APP_CONFIG.planner.defaultMode] || 5;
  const etaMinutes = distanceToTarget !== null ? Math.ceil(((distanceToTarget / 1000) / speedKmH) * 60) : null;

  const announcedPandalRef = useRef(null);
  useEffect(() => {
    if (activePandal && distanceToTarget !== null && isNavigating) {
      if (announcedPandalRef.current !== activePandal.id) {
        announcedPandalRef.current = activePandal.id;
        const name = lang === 'en' ? activePandal.name_en || activePandal.name : activePandal.name_bn || activePandal.name;
        if (lang === 'en') {
          speakPrompt(`Next pandal ${name}, ${distanceToTarget} meters ahead`);
        } else {
          speakPrompt(`পরবর্তী মণ্ডপ ${name}, আর ${distanceToTarget} মিটার`);
        }
      }
    }
  }, [activePandal, distanceToTarget, isNavigating, lang, speakPrompt]);

  return {
    isNavigating,
    currentStopIndex,
    activePandal,
    nextPandal: activePandal,
    currentManeuver,
    direction: currentManeuver,
    userLocation,
    distanceToTarget,
    distanceMeters: distanceToTarget,
    etaMinutes,
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
