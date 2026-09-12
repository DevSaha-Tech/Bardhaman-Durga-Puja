export const safeStorage = {
  get: (key, fallback = null) => {
    if (typeof window === 'undefined') return fallback;
    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        // Try parsing as JSON first, if it fails, return the raw string
        try {
          return JSON.parse(stored);
        } catch (e) {
          return stored;
        }
      }
    } catch (err) {
      console.warn('safeStorage.get failed (possibly incognito mode or quota exceeded):', err);
    }
    return fallback;
  },
  
  set: (key, value) => {
    if (typeof window === 'undefined') return false;
    try {
      const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, stringValue);
      return true;
    } catch (err) {
      console.warn('safeStorage.set failed (possibly incognito mode or quota exceeded):', err);
      return false;
    }
  },

  remove: (key) => {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (err) {
      console.warn('safeStorage.remove failed:', err);
      return false;
    }
  }
};
