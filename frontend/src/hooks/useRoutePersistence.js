import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'puja_active_plan';

export function useRoutePersistence(initialState = null) {
  const [routeState, setRouteState] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
      } catch (err) {
        console.error('Failed to load route state from localStorage', err);
      }
    }
    return initialState || {
      activePlan: null,
      selectedPandals: [],
      transportMode: 'walking',
      currentStopIndex: 0
    };
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    if (typeof window !== 'undefined' && routeState) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(routeState));
      } catch (err) {
        console.error('Failed to save route state to localStorage', err);
      }
    }
  }, [routeState]);

  const updateRouteState = useCallback((updates) => {
    setRouteState(prev => ({ ...prev, ...updates }));
  }, []);

  const resetPlan = useCallback(() => {
    setRouteState({
      activePlan: null,
      selectedPandals: [],
      transportMode: 'walking',
      currentStopIndex: 0
    });
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  return { routeState, updateRouteState, resetPlan };
}
