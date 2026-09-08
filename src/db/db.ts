/**
 * db.ts
 * ---------------------------------------------------------------------------
 * Small, dependency-free IndexedDB wrapper. Not specific to auth — any
 * module in the app can use it to cache data for offline use (dashboard
 * numbers, a student list, pending form submissions, etc.).
 *
 * Usage:
 *   await dbSet('cache', 'institution', institutionSettings);
 *   const cached = await dbGet<InstitutionSetting>('cache', 'institution');
 *
 * Stores are fixed up front (STORES below) because IndexedDB only creates
 * object stores during a version-bumped `onupgradeneeded`. Add a new store
 * name to STORES and bump DB_VERSION if you need another one later.
 * ---------------------------------------------------------------------------
 */

const DB_NAME = 'sms_offline_db';
const DB_VERSION = 1;

export type StoreName = 'session' | 'sync_queue' | 'cache';

const STORES: StoreName[] = ['session', 'sync_queue', 'cache'];

interface StoredRow<T> {
  key: string;
  value: T;
  updated_at: number;
}

let dbPromise: Promise<IDBDatabase> | null = null;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) {
      reject(new Error('IndexedDB is not supported in this browser.'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      STORES.forEach((name) => {
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath: 'key' });
        }
      });
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function getDb(): Promise<IDBDatabase> {
  if (!dbPromise) dbPromise = openDatabase();
  return dbPromise;
}

/** Reads a single value. Returns `undefined` if the key doesn't exist or IndexedDB is unavailable. */
export async function dbGet<T>(store: StoreName, key: string): Promise<T | undefined> {
  try {
    const db = await getDb();
    return await new Promise<T | undefined>((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).get(key);
      req.onsuccess = () => resolve((req.result as StoredRow<T> | undefined)?.value);
      req.onerror = () => reject(req.error);
    });
  } catch {
    return undefined;
  }
}

/** Writes (or overwrites) a single value. */
export async function dbSet<T>(store: StoreName, key: string, value: T): Promise<void> {
  try {
    const db = await getDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).put({ key, value, updated_at: Date.now() } satisfies StoredRow<T>);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // Offline caching is best-effort — a write failure here should never
    // block the feature that triggered it.
  }
}

/** Deletes a single value. No-op if it doesn't exist. */
export async function dbDelete(store: StoreName, key: string): Promise<void> {
  try {
    const db = await getDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).delete(key);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // best-effort, see dbSet
  }
}

/** Reads every row in a store, most recently updated first. */
export async function dbGetAll<T>(store: StoreName): Promise<{ key: string; value: T; updated_at: number }[]> {
  try {
    const db = await getDb();
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(store, 'readonly');
      const req = tx.objectStore(store).getAll();
      req.onsuccess = () => {
        const rows = (req.result as StoredRow<T>[]) ?? [];
        resolve(rows.sort((a, b) => b.updated_at - a.updated_at));
      };
      req.onerror = () => reject(req.error);
    });
  } catch {
    return [];
  }
}

/** Clears every row in a store. */
export async function dbClear(store: StoreName): Promise<void> {
  try {
    const db = await getDb();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(store, 'readwrite');
      tx.objectStore(store).clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch {
    // best-effort, see dbSet
  }
}