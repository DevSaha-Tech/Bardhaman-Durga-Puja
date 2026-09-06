/**
 * Generates a Google Maps Deep Link URL for turn-by-turn navigation.
 * Uses the live user location as origin and destination (closed loop).
 * Adds pandals as waypoints in the optimized order.
 * 
 * @param {Array} routeArray - Array of optimized pandal objects (excluding origin)
 * @param {Object} userLocation - {lat, lng} object of user's live location
 * @returns {string} Google Maps URL
 */
export function generateGoogleMapsUrl(routeArray, userLocation) {
    if (!routeArray || routeArray.length === 0 || !userLocation) {
        return "https://www.google.com/maps";
    }

    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = origin; // Closed loop back to start

    // Google Maps URL supports up to 9 waypoints in standard 'dir' URLs reliably via browser.
    // If we have more than 8 stops (since we need 1 origin, 1 dest = 10 total), we slice it.
    const maxWaypoints = 8;
    const waypointsArray = routeArray.slice(0, maxWaypoints);

    const waypoints = waypointsArray
        .map(p => `${p.lat},${p.lng}`)
        .join('|');

    // api=1 is required for the new universal cross-platform URL scheme
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&waypoints=${waypoints}&travelmode=walking`;

    return url;
}
