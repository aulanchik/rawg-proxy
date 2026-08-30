import { config } from '@/config/env'

const BASE_URL = 'https://api.rawg.io/api'

export class RawgClient {
  constructor(private apiKey: string) {}

  async forward(
    pathAndQuery: string,
  ): Promise<{ status: number; body: unknown }> {
    const separator = pathAndQuery.includes('?') ? '&' : '?'
    const url = `${BASE_URL}${pathAndQuery}${separator}key=${this.apiKey}`
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) })
    const body = await res.json().catch(() => ({}))
    return { status: res.status, body }
  }
}

export const rawg = new RawgClient(config.rawgApiKey)
