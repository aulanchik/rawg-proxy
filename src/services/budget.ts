import { config } from '@/config/env'

// This caps total upstream calls to RAWG per calendar month. This is the actual
// reason the proxy exists: RAWG's free tier allowance is capped requests/month,
// so we stop forwarding before we hit that ceiling.
function currentMonthKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${d.getMonth()}`
}

export class MonthlyBudget {
  private month = currentMonthKey()
  private used = 0

  constructor(private limit: number) {}

  tryConsume(): boolean {
    const month = currentMonthKey()
    if (month !== this.month) {
      this.month = month
      this.used = 0
    }
    if (this.used >= this.limit) return false
    this.used++
    return true
  }

  remaining(): number {
    return Math.max(0, this.limit - this.used)
  }
}

export const budget = new MonthlyBudget(config.monthlyBudget)
