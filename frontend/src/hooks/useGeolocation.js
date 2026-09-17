import { useState, useEffect, useRef, useCallback } from 'react';

export function useGeolocation({ mode = 'once', enableHighAccuracy = true } = {}) {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [permission, setPermission] = useState('unknown');
  const [loading, setLoading] = useState(true);
  
  const watchIdRef = useRef(null);

  const success = useCallback((pos) => {
    setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude, accuracy: pos.coords.accuracy, heading: pos.coords.heading || 0 });
    setLoading(false);
    setError(null);
  }, []);

  const handleError = useCallback((err) => {
    setError(err ? err.message : 'Unknown error');
    setLoading(false);
    if (err && err.code === 1) {
      setPermission('denied');
    }
  }, []);

  const retry = useCallback(() => {
    if (typeof window === 'undefined' || !navigator.geolocation) return;
    setLoading(true);
    setError(null);
    if (mode === 'once') {
      navigator.geolocation.getCurrentPosition(success, handleError, {
        enableHighAccuracy,
        timeout: 10000,
        maximumAge: 0,
      });
    } else if (mode === 'watch') {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      watchIdRef.current = navigator.geolocation.watchPosition(success, handleError, {
        enableHighAccuracy,
        maximumAge: 2000,
        timeout: 8000,
      });
    }
  }, [mode, enableHighAccuracy, success, handleError]);

  useEffect(() => {
    // Return safely on the server
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLoading(true);
      return;
    }

    // Check permission status if possible
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(res => {
        setPermission(res.state); // 'granted', 'denied', or 'prompt'
        res.onchange = () => {
          setPermission(res.state);
          if (res.state === 'granted' && !position) {
            retry();
          }
        };
      }).catch(() => {
        // Ignored if permissions API fails
      });
    }

    if (mode === 'once') {
      navigator.geolocation.getCurrentPosition(success, handleError, {
        enableHighAccuracy,
        timeout: 10000,
        maximumAge: 0
      });
    } else if (mode === 'watch') {
      watchIdRef.current = navigator.geolocation.watchPosition(success, handleError, {
        enableHighAccuracy,
        maximumAge: 2000,
        timeout: 8000
      });
    }

    return () => {
      if (mode === 'watch' && watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, enableHighAccuracy]);

  return { position, error, permission, loading, retry };
}
