import { isValidElement, type ReactElement } from 'react'

import { buildCity } from '@/lib/internal/city'
import type { RawGraph } from '@/lib/internal/types'
import { streetLayout } from '@/lib/internal/street'
import { Ambulance, Car, Streetlamp, StreetScene, Van } from './vehicles'

type El = ReactElement<Record<string, any>>

function flatten(node: unknown): El[] {
  if (!isValidElement(node)) return Array.isArray(node) ? node.flatMap(flatten) : []
  const el = node as El
  return [el, ...flatten(el.props.children)]
}

const providers = Array.from({ length: 6 }, (_, i) => ({
  id: `p${i}`,
  slug: `s${i}`,
  name: `Clinic ${i}`,
  kind: i % 3 === 0 ? 'hospital' : 'clinic',
}))
const raw: RawGraph = { providers: providers as any, doctors: [], affiliations: [], procedures: [], prices: [] }
const city = buildCity(raw)
const points = (l: ReturnType<typeof streetLayout>) => [...l.vehicles.map((v) => v.pos), ...l.ambulances.map((a) => a.pos), ...l.lamps]

describe('streetLayout', () => {
  it('is deterministic', () => {
    expect(streetLayout(city)).toEqual(streetLayout(buildCity(raw)))
  })

  it('places vehicles and lamps', () => {
    const l = streetLayout(city)
    expect(l.vehicles.length).toBeGreaterThan(0)
    expect(l.lamps.length).toBeGreaterThan(0)
  })

  it('parks one ambulance per hospital', () => {
    const hospitals = city.clinics.filter((c) => c.kind === 'hospital').length
    expect(streetLayout(city).ambulances).toHaveLength(hospitals)
  })

  it('keeps everything out of every clinic footprint', () => {
    for (const [x, z] of points(streetLayout(city))) {
      for (const c of city.clinics) expect(Math.hypot(x - c.pos[0], z - c.pos[1])).toBeGreaterThan(6)
    }
  })
})

describe('vehicle parts', () => {
  it('each builds geometry', () => {
    for (const part of [Car({ color: '#222' }), Van({ color: '#333' }), Ambulance(), Streetlamp()]) {
      expect(flatten(part).length).toBeGreaterThan(2)
    }
  })

  it('has glowing lamp heads', () => {
    const lit = flatten(Streetlamp()).filter((p) => p.props.emissive || p.props.children)
    expect(lit.length).toBeGreaterThan(0)
  })
})

describe('Street', () => {
  it('renders every placed object', () => {
    const l = streetLayout(city)
    const parts = flatten(StreetScene({ city }))
    expect(parts.filter((p) => p.type === Car || p.type === Van)).toHaveLength(l.vehicles.length)
    expect(parts.filter((p) => p.type === Ambulance)).toHaveLength(l.ambulances.length)
    expect(parts.filter((p) => p.type === Streetlamp)).toHaveLength(l.lamps.length)
  })
})
