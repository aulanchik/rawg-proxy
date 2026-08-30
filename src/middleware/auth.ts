import type { Request, Response, NextFunction } from 'express'
import { config } from '@/config/env'

// Extends Express's Request so downstream middleware/controllers can read
// which authenticated client made the request (used by the rate limiter).
export interface AuthedRequest extends Request {
  clientKey?: string
}

function decodeUser(header: string | undefined): string | null {
  if (!header?.startsWith('Basic ')) return null
  const decoded = Buffer.from(header.slice(6), 'base64').toString()
  const idx = decoded.indexOf(':')
  if (idx < 0) return null

  const user = decoded.slice(0, idx)
  const pass = decoded.slice(idx + 1)

  return user === config.proxyUser && pass === config.proxyPass ? user : null
}

export function auth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): void {
  const user = decodeUser(req.headers.authorization)
  if (!user) {
    res.set('WWW-Authenticate', 'Basic realm="rawg-proxy"')
    res.status(401).json({ error: 'Unauthorized' })
    return
  }
  req.clientKey = user
  next()
}
