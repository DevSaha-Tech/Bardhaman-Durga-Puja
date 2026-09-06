import * as turf from '@turf/turf';

// ============================================================
//  In-memory route cache: key = "lng1,lat1|lng2,lat2|profile"
// ============================================================
const routeCache = new Map();

function cacheKey(origin, dest, profile) {
  return `${origin[0].toFixed(5)},${origin[1].toFixed(5)}|${dest[0].toFixed(5)},${dest[1].toFixed(5)}|${profile}`;
}

// ============================================================
//  Provider 1: OSRM (fast, sometimes rate-limited)
// ============================================================
async function fetchOSRM(origin, dest, profile, signal) {
  const url = `https://router.project-osrm.org/route/v1/${profile}/${origin[0]},${origin[1]};${dest[0]},${dest[1]}?steps=true&geometries=geojson&overview=full`;
  const res  = await fetch(url, { signal });
  const data = await res.json();
  if (data.code === 'Ok' && data.routes?.length > 0) return data.routes[0];
  return null;
}

// ============================================================
//  Provider 2: Valhalla (FOSSGIS public server, no key needed)
//  Reliable alternative when OSRM rate-limits us
// ============================================================
async function fetchValhalla(origin, dest, profile, signal) {
  // Valhalla costing modes
  const costingMap = { walking: 'pedestrian', cycling: 'bicycle', driving: 'auto' };
  const costing    = costingMap[profile] || 'pedestrian';

  const body = JSON.stringify({
    locations: [
      { lon: origin[0], lat: origin[1] },
      { lon: dest[0],   lat: dest[1]   }
    ],
    costing,
    directions_options: { language: 'en-US' },
    shape_match: 'map_snap'
  });

  const url = 'https://valhalla1.openstreetmap.de/route';
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
    signal
  });
  const data = await res.json();

  if (!data.trip) return null;

  // Normalize Valhalla response → OSRM-compatible shape
  // Valhalla returns encoded polyline per leg; decode all legs
  const legs = data.trip.legs || [];
  const allCoords = [];
  for (const leg of legs) {
    const decoded = decodePolyline(leg.shape);
    allCoords.push(...decoded);
  }

  if (allCoords.length < 2) return null;

  // Build OSRM-compatible route object
  const maneuvers = legs[0]?.maneuvers || [];
  const steps = maneuvers.map(m => ({
    distance: m.length * 1000,
    maneuver: {
      type:     m.type === 1 ? 'depart' : m.type === 4 ? 'arrive' : 'turn',
      modifier: normalizeValhallaModifier(m.type),
      location: [m.begin_shape_index !== undefined ? allCoords[m.begin_shape_index]?.[0] : origin[0],
                 m.begin_shape_index !== undefined ? allCoords[m.begin_shape_index]?.[1] : origin[1]],
    },
    instruction: m.instruction || '',
  }));

  return {
    geometry: { type: 'LineString', coordinates: allCoords },
    legs: [{ steps, distance: data.trip.summary.length * 1000, duration: data.trip.summary.time }],
    distance: data.trip.summary.length * 1000,
    duration: data.trip.summary.time,
    _source: 'valhalla',
  };
}

// Valhalla maneuver type → OSRM modifier string
function normalizeValhallaModifier(type) {
  // Valhalla type codes: https://valhalla.github.io/valhalla/turn-by-turn/api-reference/
  const map = { 0: 'straight', 1: 'straight', 2: 'slight right', 3: 'right',
                4: 'sharp right', 5: 'uturn', 6: 'sharp left', 7: 'left', 8: 'slight left' };
  return map[type] || 'straight';
}

// Valhalla uses Google-encoded polyline (precision 6)
function decodePolyline(encoded, precision = 6) {
  const factor = Math.pow(10, precision);
  const result = [];
  let index = 0, lat = 0, lng = 0;
  while (index < encoded.length) {
    let b, shift = 0, result_ = 0;
    do { b = encoded.charCodeAt(index++) - 63; result_ |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lat += (result_ & 1) ? ~(result_ >> 1) : (result_ >> 1);
    shift = 0; result_ = 0;
    do { b = encoded.charCodeAt(index++) - 63; result_ |= (b & 0x1f) << shift; shift += 5; } while (b >= 0x20);
    lng += (result_ & 1) ? ~(result_ >> 1) : (result_ >> 1);
    result.push([lng / factor, lat / factor]); // [lng, lat] for GeoJSON
  }
  return result;
}

// ============================================================
//  Main export: Dual-provider fetch with cache + timeout
// ============================================================
/**
 * Fetches turn-by-turn route with automatic fallback:
 * Cache → OSRM (5s timeout) → Valhalla (8s timeout) → null
 * @param {Array} origin [lng, lat]
 * @param {Array} destination [lng, lat]
 * @param {string} profile  'walking' | 'cycling' | 'driving'
 */
export async function fetchOSRMRoute(origin, destination, profile = 'walking') {
  const key = cacheKey(origin, destination, profile);

  // 1. Cache hit → instant return
  if (routeCache.has(key)) {
    return routeCache.get(key);
  }

  // 2. Try OSRM with 5-second timeout
  try {
    const ctrl1   = new AbortController();
    const timer1  = setTimeout(() => ctrl1.abort(), 5000);
    const osrm    = await fetchOSRM(origin, destination, profile, ctrl1.signal);
    clearTimeout(timer1);
    if (osrm) {
      routeCache.set(key, osrm);
      return osrm;
    }
  } catch (e) {
    if (e.name !== 'AbortError') console.warn('[OSRM] fetch error:', e.message);
  }

  // 3. Fallback to Valhalla with 8-second timeout
  try {
    const ctrl2    = new AbortController();
    const timer2   = setTimeout(() => ctrl2.abort(), 8000);
    const valhalla = await fetchValhalla(origin, destination, profile, ctrl2.signal);
    clearTimeout(timer2);
    if (valhalla) {
      routeCache.set(key, valhalla);
      return valhalla;
    }
  } catch (e) {
    if (e.name !== 'AbortError') console.warn('[Valhalla] fetch error:', e.message);
  }

  // 4. Both failed — return null (straight-line fallback in MapView)
  console.error('[Routing] Both OSRM and Valhalla failed for this request.');
  return null;
}

// ============================================================
//  Clear cache when changing targets (call on stop change)
// ============================================================
export function clearRouteCache() {
  routeCache.clear();
}

// ============================================================
//  Snap GPS to nearest point on the route line
// ============================================================
export function snapToRoute(rawCoords, geojsonLine) {
  if (!geojsonLine || !rawCoords) return rawCoords;
  try {
    const point   = turf.point([rawCoords[1], rawCoords[0]]);
    const snapped = turf.nearestPointOnLine(geojsonLine, point);
    return [snapped.geometry.coordinates[1], snapped.geometry.coordinates[0]];
  } catch (err) {
    return rawCoords;
  }
}

// ============================================================
//  Parse maneuver from OSRM or Valhalla step
// ============================================================
export function parseManeuver(step, t) {
  if (!step || !step.maneuver) return { text: t('straight'), icon: 'ArrowUp' };

  const modifier = step.maneuver.modifier;
  const type     = step.maneuver.type;
  const distance = Math.round(step.distance || 0);
  const distText = distance > 0 ? `${distance} ${t('meters_after')} ` : '';

  if (type === 'arrive') return { text: t('arrive', { name: '' }), icon: 'MapPin' };

  switch (modifier) {
    case 'left':
    case 'sharp left':
    case 'slight left':
      return { text: `${distText}${t('turn_left')}`,  icon: 'CornerUpLeft'  };
    case 'right':
    case 'sharp right':
    case 'slight right':
      return { text: `${distText}${t('turn_right')}`, icon: 'CornerUpRight' };
    case 'straight':
      return { text: `${distance > 0 ? distance + ' ' + t('meters_after') + ' ' : ''}${t('straight')}`, icon: 'ArrowUp' };
    case 'uturn':
      return { text: t('uturn'), icon: 'CornerDownLeft' };
    default:
      return { text: t('straight'), icon: 'ArrowUp' };
  }
}
