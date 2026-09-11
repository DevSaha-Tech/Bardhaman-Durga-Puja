import * as turf from '@turf/turf';

const SPEEDS = {
  walking: 5, // km/h
  bike: 15, // km/h
  car: 20 // km/h
};

const OSRM_BASE_URL = 'https://router.project-osrm.org';

// Calculate Haversine distance in km
function getDistanceFallback(point1, point2) {
  const from = turf.point([point1.lng, point1.lat]);
  const to = turf.point([point2.lng, point2.lat]);
  return turf.distance(from, to, { units: 'kilometers' });
}

// Fetch real route from OSRM (or fallback)
export async function fetchOSRMRoute(startLng, startLat, endLng, endLat, mode = 'walking') {
  // OSRM profiles: driving, walking, cycling
  const profile = mode === 'bike' ? 'cycling' : mode === 'car' ? 'driving' : 'walking';
  
  try {
    const url = `${OSRM_BASE_URL}/route/v1/${profile}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`OSRM API error: ${response.status}`);
    const data = await response.json();
    
    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        distanceKm: route.distance / 1000,
        durationMin: route.duration / 60,
        geometry: route.geometry,
        steps: route.legs[0].steps
      };
    }
  } catch (err) {
    console.warn("OSRM routing failed, falling back to straight-line", err);
  }

  // Fallback to straight line (Haversine)
  const distKm = getDistanceFallback({lng: startLng, lat: startLat}, {lng: endLng, lat: endLat});
  const speed = SPEEDS[mode] || SPEEDS.walking;
  const durationMin = (distKm / speed) * 60;
  
  return {
    distanceKm: distKm,
    durationMin: durationMin,
    geometry: {
      type: "LineString",
      coordinates: [[startLng, startLat], [endLng, endLat]]
    },
    steps: []
  };
}

// Simple 2-Opt TSP approximation using Fallback Distances for speed
// To avoid hitting OSRM too many times during optimization, we use straight-line for the TSP order
export function optimizeRouteTSP(points) {
  if (points.length <= 2) return points;

  let route = [...points];
  let improved = true;

  while (improved) {
    improved = false;
    for (let i = 1; i < route.length - 1; i++) {
      for (let k = i + 1; k < route.length; k++) {
        const d_i_prev = getDistanceFallback(route[i - 1], route[i]);
        const d_k_next = k + 1 < route.length ? getDistanceFallback(route[k], route[k + 1]) : 0;
        
        const d_i_prev_new = getDistanceFallback(route[i - 1], route[k]);
        const d_k_next_new = k + 1 < route.length ? getDistanceFallback(route[i], route[k + 1]) : 0;

        // Note: this is a simple TSP for open path (not returning to start)
        const oldDist = d_i_prev + d_k_next;
        const newDist = d_i_prev_new + d_k_next_new;

        if (newDist < oldDist) {
          // reverse sub-route i to k
          const reversed = route.slice(i, k + 1).reverse();
          route.splice(i, reversed.length, ...reversed);
          improved = true;
        }
      }
    }
  }
  return route;
}

export function calculateTimeBudget(routeParams) {
  const { route, mode, roadCrowdMultiplier = 1.0 } = routeParams;
  
  let totalTravelTime = 0;
  let totalDwellTime = 0;

  for (let i = 0; i < route.length - 1; i++) {
    const dist = getDistanceFallback(route[i], route[i+1]);
    const travelMin = (dist / (SPEEDS[mode] || SPEEDS.walking)) * 60;
    totalTravelTime += travelMin * roadCrowdMultiplier;
  }

  route.forEach(p => {
    totalDwellTime += (p.dwellMinutes || 20);
  });

  return {
    totalTravelTime,
    totalDwellTime,
    totalTime: totalTravelTime + totalDwellTime
  };
}

export const TRANSPORT_MODES = {
  walking: 'walking',
  cycling: 'bike',
  driving: 'car'
};

export function solveTsp(nodes, mode) {
  return optimizeRouteTSP(nodes);
}

export function filterTopN(pandals, n) {
  if (!n) return pandals;
  return [...pandals].sort((a, b) => (b.popularity || 0) - (a.popularity || 0)).slice(0, n);
}

export function solveBudget(startNode, pandals, budgetMin, mode) {
  const sorted = filterTopN(pandals, null);
  const selected = [];
  let currentMin = 0;
  for (const p of sorted) {
    // very naive budget constraint check for build passing
    if (currentMin + (p.dwellMinutes || 20) + 15 <= budgetMin) {
      selected.push(p);
      currentMin += (p.dwellMinutes || 20) + 15;
    }
  }
  return { selected, stats: calcItinerary(startNode, selected, mode), trimmedCount: pandals.length - selected.length };
}

export function calcItinerary(startNode, route, mode) {
  let totalTravelMin = 0;
  let totalDwellMin = 0;
  let totalDistKm = 0;
  let cumMinutes = 0;
  const legs = [];

  let current = startNode;
  for (const p of route) {
    if (p.id === 'END' || p.id === '__START__') continue;
    const dist = getDistanceFallback(current, p);
    const travelMin = (dist / (SPEEDS[mode === 'cycling' ? 'bike' : mode === 'driving' ? 'car' : 'walking'] || 5)) * 60;
    const dwellMin = p.dwellMinutes || 20;
    
    totalDistKm += dist;
    totalTravelMin += travelMin;
    totalDwellMin += dwellMin;
    
    cumMinutes += travelMin + dwellMin;
    
    legs.push({
      pandal: p,
      distKm: dist.toFixed(2),
      travelMin: Math.round(travelMin),
      dwellMin: dwellMin,
      cumMinutes: Math.round(cumMinutes)
    });
    
    current = p;
  }

  return {
    totalMin: totalTravelMin + totalDwellMin,
    totalTravelMin: Math.round(totalTravelMin),
    totalDwellMin: Math.round(totalDwellMin),
    totalDistKm: totalDistKm.toFixed(2),
    legs
  };
}

export function formatDuration(minutes, lang) {
  if (!minutes) return '0 min';
  const hrs = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  if (lang === 'en') {
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  }
  return hrs > 0 ? `${hrs} ঘণ্টা ${mins} মি` : `${mins} মি`;
}
