import { Router } from 'express'
import { rateLimit } from '@/middleware/rateLimit'
import { proxyToRawg } from '@/controllers/rawgController'
import { auth } from '@/middleware/auth'

const router = Router()

router.get(/.*/, auth, rateLimit, proxyToRawg)

export default router
