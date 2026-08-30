import { config } from '@/config/env'

interface Window {
  windowStart: number
  count: number
}

export class RateLimiter {
  private windows = new Map<string, Window>()

  constructor(private limitPerMinute: number) {}

  allow(clientKey: string): boolean {
    const currentWindow = Math.floor(Date.now() / 60000)
    let w = this.windows.get(clientKey)
    if (!w || w.windowStart !== currentWindow) {
      w = { windowStart: currentWindow, count: 0 }
      this.windows.set(clientKey, w)
    }
    if (w.count >= this.limitPerMinute) return false
    w.count++
    return true
  }
}

export const limiter = new RateLimiter(config.rateLimitPerMinute)
