import { openDB } from 'idb';

export const ROUTE_CACHE_VERSION = 'v1';

const DB_NAME = 'puja-routes';
const STORE_NAME = 'routes';
const DB_VERSION = 2;
const MAX_ENTRIES = 500;
const EVICT_COUNT = 50;
const MIN_FREE_BYTES = 5 * 1024 * 1024; // 5 MB

let dbPromise = null;
let memoryCache = new Map();
let useMemoryFallback = false;
let fallbackWarned = false;

// Helper to gracefully initialize DB
function getDB() {
  if (typeof window === 'undefined') return null;
  if (useMemoryFallback) return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains('batch_progress')) {
          db.createObjectStore('batch_progress', { keyPath: 'routeSignature' });
        }
      },
      blocked() {
        console.warn(`[routeCache] IndexedDB blocked.`);
      },
      blocking() {
        console.warn(`[routeCache] IndexedDB blocking. Closing.`);
        if (dbPromise) dbPromise.then(db => db?.close());
        dbPromise = null;
      },
      terminated() {
        console.warn(`[routeCache] IndexedDB terminated.`);
        dbPromise = null;
      },
    }).catch(err => {
      if (!fallbackWarned) {
        console.warn(`[routeCache] IndexedDB unavailable, falling back to in-memory Map. Reason:`, err);
        fallbackWarned = true;
      }
      useMemoryFallback = true;
      dbPromise = null;
      return null;
    });
  }
  return dbPromise;
}

// Add global onversionchange handler if possible
if (typeof window !== 'undefined') {
  getDB()?.then(db => {
    if (db) {
      db.addEventListener('versionchange', () => {
        db.close();
        dbPromise = null;
      });
    }
  });
}

export function isPersistenceAvailable() {
  return !useMemoryFallback && typeof window !== 'undefined' && !!window.indexedDB;
}

export async function getCachedRoute(key) {
  try {
    if (useMemoryFallback) {
      const entry = memoryCache.get(key);
      return entry ? entry.data : null;
    }

    const db = await getDB();
    if (!db) {
      const entry = memoryCache.get(key);
      return entry ? entry.data : null;
    }

    const entry = await db.get(STORE_NAME, key);
    return entry ? entry.data : null;
  } catch (error) {
    console.warn(`[routeCache] Error reading key ${key}:`, error);
    return null;
  }
}

async function evictOldest(db, count) {
  try {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    let entries = await store.getAll();
    if (entries.length > 0) {
      entries.sort((a, b) => a.cachedAt - b.cachedAt);
      const toDelete = entries.slice(0, count);
      for (const entry of toDelete) {
        store.delete(entry.key);
      }
      await tx.done;
    }
  } catch (err) {
    console.warn(`[routeCache] Eviction failed:`, err);
  }
}

export async function setCachedRoute(key, data) {
  try {
    const entry = {
      key,
      data,
      cachedAt: Date.now(),
      version: ROUTE_CACHE_VERSION
    };

    if (useMemoryFallback) {
      if (memoryCache.size >= MAX_ENTRIES) {
        const oldestKeys = [...memoryCache.entries()]
          .sort((a, b) => a[1].cachedAt - b[1].cachedAt)
          .slice(0, EVICT_COUNT)
          .map(e => e[0]);
        for (const k of oldestKeys) memoryCache.delete(k);
      }
      memoryCache.set(key, entry);
      return true;
    }

    const db = await getDB();
    if (!db) {
      memoryCache.set(key, entry);
      return true;
    }

    // Check storage quota estimate
    if (navigator.storage && navigator.storage.estimate) {
      try {
        const estimate = await navigator.storage.estimate();
        if (estimate.quota && estimate.usage) {
          const free = estimate.quota - estimate.usage;
          if (free < MIN_FREE_BYTES) {
            await evictOldest(db, EVICT_COUNT);
          }
        }
      } catch (e) {
        // Ignore estimate errors
      }
    }

    // Check count for LRU eviction
    let count = await db.count(STORE_NAME);
    if (count >= MAX_ENTRIES) {
      await evictOldest(db, EVICT_COUNT);
    }

    try {
      await db.put(STORE_NAME, entry);
      return true;
    } catch (putError) {
      if (putError.name === 'QuotaExceededError') {
        console.warn(`[routeCache] Quota exceeded. Evicting oldest and retrying.`);
        await evictOldest(db, EVICT_COUNT);
        try {
          await db.put(STORE_NAME, entry);
          return true;
        } catch (retryError) {
          console.warn(`[routeCache] Retry failed after quota exceeded:`, retryError);
          return false;
        }
      }
      throw putError;
    }
  } catch (error) {
    console.warn(`[routeCache] Error writing key ${key}:`, error);
    return false;
  }
}

export async function clearRouteCache() {
  try {
    if (useMemoryFallback) {
      memoryCache.clear();
      return true;
    }
    const db = await getDB();
    if (db) {
      await db.clear(STORE_NAME);
    }
    return true;
  } catch (error) {
    console.warn(`[routeCache] Error clearing cache:`, error);
    return false;
  }
}

export async function getCacheStats() {
  try {
    if (useMemoryFallback) {
      return { count: memoryCache.size, sizeKB: 0 };
    }
    const db = await getDB();
    if (db) {
      const count = await db.count(STORE_NAME);
      // Rough size estimation is not trivially available in IndexedDB.
      return { count, sizeKB: 'unknown' };
    }
    return { count: 0, sizeKB: 0 };
  } catch (error) {
    console.warn(`[routeCache] Error getting stats:`, error);
    return { count: 0, sizeKB: 0 };
  }
}
