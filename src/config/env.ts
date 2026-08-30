import dotenv from 'dotenv'
dotenv.config()

export const config = {
  port: Number(process.env.PORT ?? 8080),
  rawgApiKey: process.env.RAWG_API_KEY ?? '',
  proxyUser: process.env.PROXY_USER ?? 'admin',
  proxyPass: process.env.PROXY_PASS ?? 'admin',
  rateLimitPerMinute: Number(process.env.RATE_LIMIT_PER_MIN ?? 60),
  cacheTtlSeconds: Number(process.env.CACHE_TTL_SECONDS ?? 3600),
  cacheMaxEntries: Number(process.env.CACHE_MAX_ENTRIES ?? 1000),
  monthlyBudget: Number(process.env.MONTHLY_BUDGET ?? 9500),
}
