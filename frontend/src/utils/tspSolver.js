// ============================================================
//  Puja Parikrama — Advanced Routing Engine (Time-Constrained Orienteering)
//  Implements: Haversine, 2-Opt TSP, Time Budget Solver, Top-N Filter
// ============================================================

// --- Transport Mode Configuration ---
export const TRANSPORT_MODES = {
  walking: { label: 'হাঁটা', labelEn: 'Walk', speed: 5,  osrmProfile: 'walking',  icon: 'footprints' },
  cycling: { label: 'সাইকেল/বাইক', labelEn: 'Bike',  speed: 15, osrmProfile: 'cycling',  icon: 'bike'       },
  driving: { label: 'গাড়ি',  labelEn: 'Car',  speed: 20, osrmProfile: 'driving',  icon: 'car'        },
};

// --- Crowd Multiplier Map ---
const CROWD_MULTIPLIER = {
  'High':   1.5,
  'Medium': 1.25,
  'Low':    1.05,
};

// ============================================================
//  Core Haversine Distance (km)
// ============================================================
export function getDistance(p1, p2) {
  const R = 6371;
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLon = (p2.lng - p1.lng) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// ============================================================
//  Travel Time (minutes) between two points
//  includes road crowd multiplier
// ============================================================
export function getTravelTime(p1, p2, speedKmh, crowdLevel = 'Low') {
  const distKm  = getDistance(p1, p2);
  const baseMin = (distKm / speedKmh) * 60;
  const mult    = CROWD_MULTIPLIER[crowdLevel] ?? 1.0;
  return baseMin * mult;
}

// ============================================================
//  2-Opt TSP Solver (Nearest-Neighbour init + 2-opt swap)
// ============================================================
export function solveTsp(points, transportMode = 'walking') {
  if (!points || points.length <= 1) return points;
  const speed = TRANSPORT_MODES[transportMode]?.speed ?? 5;

  // --- Nearest Neighbour Init ---
  const visited = [points[0]];
  const remaining = points.slice(1);

  while (remaining.length > 0) {
    const last = visited[visited.length - 1];
    let nearestIdx = 0;
    let minDist = Infinity;
    remaining.forEach((p, i) => {
      const d = getDistance(last, p);
      if (d < minDist) { minDist = d; nearestIdx = i; }
    });
    visited.push(remaining.splice(nearestIdx, 1)[0]);
  }

  let route = visited;

  // --- 2-Opt Refinement ---
  let improved = true;
  while (improved) {
    improved = false;
    for (let i = 1; i < route.length - 2; i++) {
      for (let j = i + 1; j < route.length - 1; j++) {
        const before = getDistance(route[i - 1], route[i]) + getDistance(route[j], route[j + 1]);
        const after  = getDistance(route[i - 1], route[j]) + getDistance(route[i], route[j + 1]);
        if (after < before) {
          route.splice(i, j - i + 1, ...route.slice(i, j + 1).reverse());
          improved = true;
        }
      }
    }
  }

  return route;
}

// ============================================================
//  Calculate full itinerary stats for an ordered route
//  Returns: { totalTravelMin, totalDwellMin, totalDistKm, legs }
// ============================================================
export function calcItinerary(origin, pandals, transportMode = 'walking') {
  const speed = TRANSPORT_MODES[transportMode]?.speed ?? 5;
  const legs  = [];
  let totalTravelMin = 0;
  let totalDwellMin  = 0;
  let totalDistKm    = 0;
  let cursor = origin;

  pandals.forEach((pandal, idx) => {
    const distKm    = getDistance(cursor, pandal);
    const travelMin = getTravelTime(cursor, pandal, speed, pandal.crowdLevel || 'Low');
    const dwellMin  = pandal.dwellMinutes ?? 15;

    totalTravelMin += travelMin;
    totalDwellMin  += dwellMin;
    totalDistKm    += distKm;

    legs.push({
      index:       idx,
      pandal,
      distKm:      Math.round(distKm * 10) / 10,
      travelMin:   Math.round(travelMin),
      dwellMin,
      cumMinutes:  Math.round(totalTravelMin + totalDwellMin),
    });

    cursor = pandal;
  });

  // Return trip
  if (pandals.length > 0) {
    const returnDist    = getDistance(cursor, origin);
    const returnTravel  = getTravelTime(cursor, origin, speed, 'Low');
    totalTravelMin += returnTravel;
    totalDistKm    += returnDist;
  }

  return {
    totalTravelMin: Math.round(totalTravelMin),
    totalDwellMin:  Math.round(totalDwellMin),
    totalMin:       Math.round(totalTravelMin + totalDwellMin),
    totalDistKm:    Math.round(totalDistKm * 10) / 10,
    legs,
  };
}

// ============================================================
//  TOP-N FILTER — returns the N highest-priority pandals
// ============================================================
export function filterTopN(pandals, n) {
  if (!n || n >= pandals.length) return [...pandals];
  return [...pandals]
    .sort((a, b) => (a.popularity ?? 99) - (b.popularity ?? 99))
    .slice(0, n);
}

// ============================================================
//  TIME-CONSTRAINED ORIENTEERING
//  Greedily adds highest-ranked pandals until budget exhausted.
//  Returns: { selected, stats, trimmedCount, message }
// ============================================================
export function solveBudget(origin, pandals, budgetMinutes, transportMode = 'walking') {
  // Sort by priority (1 = highest)
  const ranked = [...pandals].sort((a, b) => (a.popularity ?? 99) - (b.popularity ?? 99));

  let selected = [];

  for (const candidate of ranked) {
    const tentative  = [...selected, candidate];
    const routeNodes = [{ id: '__START__', ...origin }, ...tentative];
    const solved     = solveTsp(routeNodes, transportMode).filter(p => p.id !== '__START__');
    const stats      = calcItinerary(origin, solved, transportMode);

    if (stats.totalMin <= budgetMinutes) {
      selected = solved; // 2-Opt already sorted this
    }
  }

  const stats       = selected.length > 0 ? calcItinerary(origin, selected, transportMode) : null;
  const trimmedCount = pandals.length - selected.length;

  return { selected, stats, trimmedCount };
}

// ============================================================
//  Format minutes to human-readable (Bengali / English)
// ============================================================
export function formatDuration(minutes, lang = 'bn') {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (lang === 'bn') {
    if (h === 0) return `${m} মিনিট`;
    if (m === 0) return `${h} ঘণ্টা`;
    return `${h} ঘণ্টা ${m} মিনিট`;
  }
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}
