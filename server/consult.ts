export const CONSULT_STATUS = ['awaiting_payment', 'in_review', 'approved', 'changes_requested'] as const

export type ConsultStatus = (typeof CONSULT_STATUS)[number]

const DEFAULT_PRICE_CENTS = 15000
const MIN_PRICE_CENTS = 100
const MAX_PRICE_CENTS = 1_000_000

export function consultPriceCents(env: Record<string, string | undefined> = process.env) {
  const value = Number(env.CONSULT_PRICE_CENTS)
  return Number.isInteger(value) && value >= MIN_PRICE_CENTS && value <= MAX_PRICE_CENTS ? value : DEFAULT_PRICE_CENTS
}
