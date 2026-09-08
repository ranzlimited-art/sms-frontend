import { useEffect, useState, useCallback } from 'react';
import { dbGet, dbSet } from '../db/db';

interface UseCachedApiDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  isStale: boolean;       // true when `data` came from cache, not a live fetch
  cachedAt: Date | null;  // when the cached copy was last successfully fetched
  refetch: () => void;
}

interface CacheEnvelope<T> {
  value: T;
  cachedAt: string; // ISO timestamp
}

/**
 * Read-cached data pattern (per our offline tiers):
 *  1. Try the network first.
 *  2. On success: store the result + timestamp in IndexedDB, return it fresh.
 *  3. On failure (offline, timeout, server error): fall back to whatever's
 *     cached, and flag `isStale` so the UI can show a banner.
 *  4. No cache AND no network -> surface the error as usual.
 *
 * `cacheKey` should be unique per resource+user, e.g. 'dashboard:staff'
 * or `dashboard:parent:${userId}` if the data varies per user and multiple
 * users might share a device.
 */
export function useCachedApiData<T>(
  cacheKey: string,
  fetcher: () => Promise<T>
): UseCachedApiDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isStale, setIsStale] = useState(false);
  const [cachedAt, setCachedAt] = useState<Date | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  const refetch = useCallback(() => setReloadToken((n) => n + 1), []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetcher();
        if (cancelled) return;

        setData(result);
        setIsStale(false);
        setCachedAt(new Date());

        // Best-effort cache write — never block the UI on this.
        const envelope: CacheEnvelope<T> = { value: result, cachedAt: new Date().toISOString() };
        void dbSet('cache', cacheKey, envelope);
      } catch (err) {
        if (cancelled) return;

        // Network failed (or server error) — fall back to cache.
        try {
          const cached = await dbGet<CacheEnvelope<T>>('cache', cacheKey);
          if (cached) {
            setData(cached.value);
            setIsStale(true);
            setCachedAt(new Date(cached.cachedAt));
          } else {
            setError(err instanceof Error ? err.message : 'Something went wrong.');
          }
        } catch {
          setError(err instanceof Error ? err.message : 'Something went wrong.');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reloadToken, cacheKey]);

  return { data, loading, error, isStale, cachedAt, refetch };
}