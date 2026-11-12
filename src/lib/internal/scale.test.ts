import { scaleFor } from './scale'
import type { Clinic } from './types'

const clinic = (doctors: number, prices: { amount: number; max?: number | null }[]) =>
  ({
    doctors: Array.from({ length: doctors }, () => ({})),
    prices: prices.map((p) => ({ amount: p.amount, max: p.max ?? null })),
  }) as unknown as Clinic

describe('scaleFor', () => {
  it('keeps an empty clinic small', () => {
    const s = scaleFor(clinic(0, []))
    expect(s.h).toBeLessThan(1)
    expect(s.w).toBe(1)
  })

  it('grows with the number of doctors', () => {
    expect(scaleFor(clinic(8, [])).h).toBeGreaterThan(scaleFor(clinic(2, [])).h)
  })

  it('grows with price size', () => {
    const cheap = scaleFor(clinic(2, [{ amount: 5000 }]))
    const dear = scaleFor(clinic(2, [{ amount: 5000000 }]))
    expect(dear.h).toBeGreaterThan(cheap.h)
  })

  it('uses the top of a price range', () => {
    const flat = scaleFor(clinic(2, [{ amount: 10000 }]))
    const range = scaleFor(clinic(2, [{ amount: 10000, max: 9000000 }]))
    expect(range.h).toBeGreaterThan(flat.h)
  })

  it('is clamped so footprints never collide', () => {
    const s = scaleFor(clinic(500, Array.from({ length: 500 }, () => ({ amount: 1e9 }))))
    expect(s.w).toBeLessThanOrEqual(1.35)
    expect(s.h).toBeLessThanOrEqual(2.2)
  })
})
