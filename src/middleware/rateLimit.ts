import type { Response, NextFunction } from 'express'
import type { AuthedRequest } from '@/middleware/auth'
import { limiter } from '@/services/limiter'
import { Logger } from '@/utils/logger'

export function rateLimit(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
): void {
  const clientKey = req.clientKey ?? 'anonymous'
  if (!limiter.allow(clientKey)) {
    res.status(429).json({ error: 'Rate limit exceeded' })
    Logger.error('Rate limit exceeded')
    return
  }
  next()
}
