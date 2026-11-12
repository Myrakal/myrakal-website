import { buildCity, money, priceLabel, relatedTo } from './city'
import type { RawGraph } from './types'

const base = { kind: null, address: null, city: null, region: null, country: null, postal_code: null, phone: null, website: null }
const doc = { specialty: null, credentials: null, languages: [] }

const raw: RawGraph = {
  providers: [
    { id: 'p2', slug: 'b', name: 'B', ...base },
    { id: 'p1', slug: 'a', name: 'A', ...base },
  ],
  doctors: [
    { id: 'd1', slug: 'd1', name: 'D1', ...doc },
    { id: 'd2', slug: 'd2', name: 'D2', ...doc },
    { id: 'd3', slug: 'd3', name: 'Unaffiliated', ...doc },
  ],
  affiliations: [
    { id: 'a1', doctor_id: 'd1', provider_id: 'p1', role: null },
    { id: 'a2', doctor_id: 'd1', provider_id: 'p2', role: null },
    { id: 'a3', doctor_id: 'd2', provider_id: 'p2', role: null },
    { id: 'a4', doctor_id: 'dx', provider_id: 'p2', role: null },
  ],
  procedures: [{ id: 'x', slug: 'x', name: 'MRI', category: null }],
  prices: [
    { id: 'r1', provider_id: 'p1', procedure_id: 'x', price_type: 'cash', amount_cents: '90000', amount_max_cents: null },
    { id: 'r2', provider_id: 'p2', procedure_id: 'x', price_type: 'range', amount_cents: 120000, amount_max_cents: '150000' },
    { id: 'r3', provider_id: 'zz', procedure_id: 'x', price_type: 'cash', amount_cents: 1, amount_max_cents: null },
  ],
}

describe('money and priceLabel', () => {
  it('formats cents as whole dollars', () => {
    expect(money(123456)).toBe('$1,235')
  })
  it('uses en-US grouping regardless of locale', () => {
    const spy = jest.spyOn(Number.prototype, 'toLocaleString').mockImplementation(function (this: number, l?: unknown) {
      return l === 'en-US' ? String(this).replace(/\B(?=(\d{3})+(?!\d))/g, ',') : String(this).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    })
    expect(money(123456)).toBe('$1,235')
    spy.mockRestore()
  })
  it('formats ranges and singles', () => {
    expect(priceLabel({ procedureId: 'x', name: 'n', type: 'range', amount: 100000, max: 200000 })).toBe('$1,000–$2,000')
    expect(priceLabel({ procedureId: 'x', name: 'n', type: 'cash', amount: 100000, max: null })).toBe('$1,000')
  })
})

describe('buildCity', () => {
  const city = buildCity(raw)

  it('sorts clinics by slug and lays them on a centred grid', () => {
    expect(city.clinics.map((c) => c.id)).toEqual(['p1', 'p2'])
    expect(city.clinics[0].pos).toEqual([-27, 0])
    expect(city.clinics[1].pos).toEqual([-9, 0])
    expect(city.extent).toEqual([90, 36])
  })

  it('links doctors to clinics and ignores orphans', () => {
    expect(city.doctors.map((d) => d.id).sort()).toEqual(['d1', 'd2'])
    expect(city.clinicById.p2.doctors.map((d) => d.id)).toEqual(['d1', 'd2'])
    expect(city.docById.d1.clinics.map((c) => c.id)).toEqual(['p1', 'p2'])
  })

  it('creates one link per extra clinic', () => {
    expect(city.links).toHaveLength(1)
    expect(city.links[0]).toMatchObject({ id: 'd1:p2', doctorId: 'd1', clinicIds: ['p1', 'p2'] })
  })

  it('converts string cents to numbers and marks the cheapest', () => {
    const [a] = city.clinicById.p1.prices
    expect(a.amount).toBe(90000)
    expect(a.best).toBe(true)
    const [b] = city.clinicById.p2.prices
    expect(b.max).toBe(150000)
    expect(b.best).toBe(false)
  })

  it('is deterministic', () => {
    expect(buildCity(raw).filler).toEqual(city.filler)
  })
})

describe('duplicate affiliations', () => {
  const dup: RawGraph = {
    ...raw,
    affiliations: [...raw.affiliations, { id: 'a5', doctor_id: 'd1', provider_id: 'p1', role: null }, { id: 'a6', doctor_id: 'd1', provider_id: 'p2', role: null }],
  }
  const city = buildCity(dup)
  it('keeps one entry per doctor and clinic pair', () => {
    expect(city.docById.d1.clinics.map((c) => c.id)).toEqual(['p1', 'p2'])
    expect(city.clinicById.p1.doctors.map((d) => d.id)).toEqual(['d1'])
  })
  it('creates no self-links or duplicate link ids', () => {
    expect(city.links.map((l) => l.id)).toEqual(['d1:p2'])
  })
})

describe('relatedTo', () => {
  const city = buildCity(raw)
  it('is inactive without hover', () => {
    expect(relatedTo(city, null).active).toBe(false)
  })
  it('collects doctors for a clinic', () => {
    const r = relatedTo(city, { type: 'clinic', id: 'p2' })
    expect([...r.doctors].sort()).toEqual(['d1', 'd2'])
    expect([...r.clinics]).toEqual(['p2'])
  })
  it('collects clinics for a doctor', () => {
    const r = relatedTo(city, { type: 'doctor', id: 'd1' })
    expect([...r.clinics].sort()).toEqual(['p1', 'p2'])
  })
})
