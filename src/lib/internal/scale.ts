import type { Clinic } from './types'

export type Scale = { w: number; h: number }

const finite = (n: number | null | undefined) => (Number.isFinite(n) ? (n as number) : 0)
const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))

export function scaleFor(clinic: Clinic): Scale {
  const prices = clinic.prices
  const dollars = prices.reduce((sum, p) => sum + Math.max(finite(p.amount), finite(p.max)), 0) / 100
  const avg = prices.length ? dollars / prices.length : 0
  const raw = clinic.doctors.length + prices.length * 0.5 + Math.log10(1 + avg) * 2
  const t = clamp(raw / 16, 0, 1)
  return { w: 1 + 0.35 * t, h: 0.9 + 1.3 * t }
}
