/**
 * Simple in-memory cache with TTL
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class Cache {
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL: number = 10 * 60 * 1000; // 10 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  get<T>(key: string, ttl?: number): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const age = Date.now() - entry.timestamp;
    const maxAge = ttl || this.defaultTTL;

    if (age > maxAge) {
      this.cache.delete(key);
      return null;
    }

    return entry.data as T;
  }

  clear(): void {
    this.cache.clear();
  }

  delete(key: string): void {
    this.cache.delete(key);
  }
}

export const weatherCache = new Cache();
