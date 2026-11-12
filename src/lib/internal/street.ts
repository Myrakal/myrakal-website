import { mulberry32, SPACING } from './city'
import type { City, Vec2 } from './types'

const BODIES = ['#1c1f27', '#2b2f3a', '#3a1d1d', '#1f2b33', '#4a4d56']

type Parked = { pos: Vec2; rot: number; van: boolean; color: string }

export function streetLayout(city: City) {
  const cols = Math.round(city.extent[0] / SPACING) - 1
  const rows = Math.round(city.extent[1] / SPACING) - 1
  const center = (i: number, n: number) => (i - (n - 1) / 2) * SPACING
  const edge = (i: number, n: number) => center(i, n) - SPACING / 2
  const ambulances = city.clinics
    .filter((c) => c.kind === 'hospital')
    .map((c) => ({ pos: [c.pos[0] - 2.5, c.pos[1] + 6.2] as Vec2, rot: 0 }))
  const rng = mulberry32(11)
  const vehicles: Parked[] = []
  const lamps: Vec2[] = []
  const park = (pos: Vec2, rot: number) => {
    const van = rng() < 0.25
    const color = BODIES[Math.floor(rng() * BODIES.length)]
    const blocked = ambulances.some((a) => Math.hypot(a.pos[0] - pos[0], a.pos[1] - pos[1]) < 3.4)
    if (rng() < 0.6 && !blocked) vehicles.push({ pos, rot, van, color })
  }
  for (let j = 0; j <= rows; j++) {
    for (let i = 0; i < cols; i++) {
      const x = center(i, cols)
      const z = edge(j, rows)
      park([x + (rng() - 0.5) * 6, z + (rng() < 0.5 ? -1.3 : 1.3)], rng() < 0.5 ? 0 : Math.PI)
      lamps.push([x + 4.5, z + 2.2])
    }
  }
  for (let i = 0; i <= cols; i++) {
    for (let j = 0; j < rows; j++) {
      const x = edge(i, cols)
      const z = center(j, rows)
      park([x + (rng() < 0.5 ? -1.3 : 1.3), z + (rng() - 0.5) * 6], rng() < 0.5 ? Math.PI / 2 : -Math.PI / 2)
      lamps.push([x + 2.2, z + 4.5])
    }
  }
  return { vehicles, ambulances, lamps }
}
