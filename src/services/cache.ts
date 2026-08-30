import { config } from '@/config/env'

// Simple in-memory TTL cache with LRU-style eviction. Not a "real" cache
// (no Redis/Memcached) - single process, lost on restart. Intentional
// trade-off for this proxy; swap for Redis if you need multi-instance state.
interface CacheEntry {
  status: number
  body: unknown
  expiresAt: number
}

export class Cache {
  private store = new Map<string, CacheEntry>()

  constructor(
    private ttlSeconds: number,
    private maxEntries: number,
  ) {}

  get(key: string): CacheEntry | undefined {
    const entry = this.store.get(key)
    if (!entry) return undefined
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key)
      return undefined
    }
    this.store.delete(key)
    this.store.set(key, entry)
    return entry
  }

  set(key: string, status: number, body: unknown): void {
    if (this.store.size >= this.maxEntries) {
      const oldestKey = this.store.keys().next().value
      if (oldestKey !== undefined) this.store.delete(oldestKey)
    }
    this.store.set(key, {
      status,
      body,
      expiresAt: Date.now() + this.ttlSeconds * 1000,
    })
  }
}

export const cache = new Cache(config.cacheTtlSeconds, config.cacheMaxEntries)
