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
const bigCity = buildCity({
  ...raw,
  providers: Array.from({ length: 16 }, (_, i) => ({ id: `q${i}`, slug: `q${String(i).padStart(2, '0')}`, name: `H ${i}`, kind: 'hospital' })) as any,
})
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

  it('keeps parked vehicles and ambulances clear of each other', () => {
    for (const c of [city, bigCity]) {
      const l = streetLayout(c)
      const all = [...l.vehicles, ...l.ambulances].map((v) => v.pos)
      for (let i = 0; i < all.length; i++) {
        for (let j = i + 1; j < all.length; j++) {
          expect(Math.hypot(all[i][0] - all[j][0], all[i][1] - all[j][1])).toBeGreaterThan(2.4)
        }
      }
    }
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

  it('has a glowing emissive lamp head above the pole', () => {
    const head = flatten(Streetlamp()).find((p) => p.props.color === '#ffd28a' && p.props.position?.[1] > 3)
    expect(head).toBeDefined()
    const mat = flatten((head!.type as any)(head!.props)).find((p) => p.props.emissive)
    expect(mat?.props.emissive).toBe('#ffd28a')
    expect(mat?.props.emissiveIntensity).toBeGreaterThan(1)
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
