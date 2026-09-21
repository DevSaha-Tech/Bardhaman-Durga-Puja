import { openDB } from 'idb';

const DB_NAME = 'puja-routes';
const STORE_NAME = 'batch_progress';
const DB_VERSION = 2;

let dbPromise = null;
let memoryCache = new Map();
let useMemoryFallback = false;

function getDB() {
  if (typeof window === 'undefined') return null;
  if (useMemoryFallback) return null;
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('routes')) {
          db.createObjectStore('routes', { keyPath: 'key' });
        }
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'routeSignature' });
        }
      }
    }).catch(err => {
      console.warn(`[batchStorage] IndexedDB unavailable, falling back to memory.`, err);
      useMemoryFallback = true;
      dbPromise = null;
      return null;
    });
  }
  return dbPromise;
}

export const computeRouteSignature = (stopIds) => stopIds.join(',');

export const getBatchCount = (stopCount) => Math.ceil(stopCount / 10);

export async function getBatchProgress(routeSignature) {
  try {
    if (useMemoryFallback) {
      return memoryCache.get(routeSignature) || null;
    }
    const db = await getDB();
    if (!db) {
      return memoryCache.get(routeSignature) || null;
    }
    const record = await db.get(STORE_NAME, routeSignature);
    return record || null;
  } catch (error) {
    console.warn(`[batchStorage] Error reading key ${routeSignature}:`, error);
    return null;
  }
}

export async function setBatchProgress(routeSignature, record) {
  try {
    if (useMemoryFallback) {
      memoryCache.set(routeSignature, record);
      return true;
    }
    const db = await getDB();
    if (!db) {
      memoryCache.set(routeSignature, record);
      return true;
    }
    await db.put(STORE_NAME, record);
    return true;
  } catch (error) {
    console.warn(`[batchStorage] Error writing key ${routeSignature}:`, error);
    return false;
  }
}

export async function clearBatchProgress(routeSignature) {
  try {
    if (useMemoryFallback) {
      memoryCache.delete(routeSignature);
      return true;
    }
    const db = await getDB();
    if (!db) {
      memoryCache.delete(routeSignature);
      return true;
    }
    await db.delete(STORE_NAME, routeSignature);
    return true;
  } catch (error) {
    console.warn(`[batchStorage] Error deleting key ${routeSignature}:`, error);
    return false;
  }
}
