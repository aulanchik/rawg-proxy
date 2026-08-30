import type { Request, Response, NextFunction } from 'express'
import { cache } from '@/services/cache'
import { budget } from '@/services/budget'
import { rawg } from '@/services/rawg'
import { Logger } from '@/utils/logger'

export async function proxyToRawg(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const pathAndQuery = req.originalUrl.replace(/^\/api/, '')

  const cached = cache.get(pathAndQuery)
  if (cached) {
    Logger.info(`[Cache HIT]: ${pathAndQuery}`)
    res.set('X-Cache', 'HIT')
    res.status(cached.status).json(cached.body)
    return
  }

  if (!budget.tryConsume()) {
    res.status(503).json({ error: 'Monthly RAWG budget exhausted' })
    Logger.error('Monthly RAWG budget exhausted')
    return
  }

  try {
    const upstream = await rawg.forward(pathAndQuery)
    cache.set(pathAndQuery, upstream.status, upstream.body)
    Logger.info(`[Cache MISS]: HTTP ${upstream.status} -> ${pathAndQuery} `)
    res.set('X-Cache', 'MISS')
    res.status(upstream.status).json(upstream.body)
  } catch (err) {
    next(err)
  }
}
