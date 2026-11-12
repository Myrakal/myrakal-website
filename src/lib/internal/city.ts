import type { City, Clinic, Doctor, Filler, Hover, Link, PriceLine, RawGraph, Vec2 } from './types'

const SPACING = 18
const COLS = 4

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export const money = (cents: number | string) => `$${Math.round(Number(cents) / 100).toLocaleString()}`

export function priceLabel(p: PriceLine) {
  if (p.type === 'range' && p.max) return `${money(p.amount)}–${money(p.max)}`
  return money(p.amount)
}

export function buildCity(raw: RawGraph): City {
  const providers = [...raw.providers].sort((a, b) => a.slug.localeCompare(b.slug))
  const rows = Math.ceil(providers.length / COLS)
  const center = (i: number, n: number) => (i - (n - 1) / 2) * SPACING

  const clinics: Clinic[] = providers.map((p, i) => ({
    ...p,
    pos: [center(i % COLS, COLS), center(Math.floor(i / COLS), rows)],
    doctors: [],
    prices: [],
  }))
  const clinicById = Object.fromEntries(clinics.map((c) => [c.id, c]))
  const procById = Object.fromEntries(raw.procedures.map((p) => [p.id, p]))
  const docById: Record<string, Doctor> = Object.fromEntries(
    raw.doctors.map((d) => [d.id, { ...d, pos: [0, 0] as Vec2, clinics: [] }]),
  )
  const order = Object.fromEntries(clinics.map((c, i) => [c.id, i]))

  for (const a of raw.affiliations) {
    const c = clinicById[a.provider_id]
    const d = docById[a.doctor_id]
    if (!c || !d) continue
    c.doctors.push(d)
    d.clinics.push(c)
  }

  for (const pr of raw.prices) {
    const c = clinicById[pr.provider_id]
    const proc = procById[pr.procedure_id]
    if (!c || !proc) continue
    c.prices.push({
      procedureId: proc.id,
      name: proc.name,
      type: pr.price_type,
      amount: Number(pr.amount_cents),
      max: pr.amount_max_cents == null ? null : Number(pr.amount_max_cents),
    })
  }
  const cheapest: Record<string, number> = {}
  for (const c of clinics) {
    for (const p of c.prices) {
      if (!(p.procedureId in cheapest) || p.amount < cheapest[p.procedureId]) {
        cheapest[p.procedureId] = p.amount
      }
    }
  }
  for (const c of clinics) {
    c.prices.sort((a, b) => a.name.localeCompare(b.name))
    for (const p of c.prices) p.best = p.amount === cheapest[p.procedureId]
  }

  const doctors = Object.values(docById).filter((d) => d.clinics.length)
  for (const d of doctors) d.clinics.sort((a, b) => order[a.id] - order[b.id])
  const byPrimary: Record<string, Doctor[]> = {}
  for (const d of doctors) (byPrimary[d.clinics[0].id] ||= []).push(d)
  for (const [cid, list] of Object.entries(byPrimary)) {
    const c = clinicById[cid]
    list.forEach((d, k) => {
      const a = Math.PI / 4 + (k - (list.length - 1) / 2) * 0.75
      d.pos = [c.pos[0] + Math.cos(a) * 4.1, c.pos[1] + Math.sin(a) * 4.1]
    })
  }

  const links: Link[] = []
  for (const d of doctors) {
    for (const c of d.clinics.slice(1)) {
      const door = [c.pos[0] + 3.9 * Math.SQRT1_2, c.pos[1] + 3.9 * Math.SQRT1_2]
      links.push({
        id: `${d.id}:${c.id}`,
        doctorId: d.id,
        clinicIds: [d.clinics[0].id, c.id],
        points: [
          [d.pos[0], 0.08, d.pos[1]],
          [d.pos[0], 0.08, door[1]],
          [door[0], 0.08, door[1]],
        ],
      })
    }
  }

  const rng = mulberry32(7)
  const filler: Filler[] = []
  for (let i = 0; i <= COLS; i++) {
    for (let j = 0; j <= rows; j++) {
      const x = center(i, COLS) - SPACING / 2
      const z = center(j, rows) - SPACING / 2
      const n = 2 + Math.floor(rng() * 2)
      for (let k = 0; k < n; k++) {
        filler.push({
          kind: rng() < 0.35 ? 'tree' : 'block',
          pos: [x + (rng() - 0.5) * 6, z + (rng() - 0.5) * 6],
          h: 1.2 + rng() * 2.6,
          w: 1.2 + rng() * 1.2,
        })
      }
    }
  }

  const extent: Vec2 = [(COLS + 1) * SPACING, (rows + 1) * SPACING]
  return { clinics, doctors, links, filler, extent, clinicById, docById }
}

export function relatedTo(city: City, hover: Hover) {
  const clinics = new Set<string>()
  const doctors = new Set<string>()
  if (!hover) return { clinics, doctors, active: false }
  if (hover.type === 'clinic') {
    clinics.add(hover.id)
    for (const d of city.clinicById[hover.id].doctors) doctors.add(d.id)
  } else {
    doctors.add(hover.id)
    for (const c of city.docById[hover.id].clinics) clinics.add(c.id)
  }
  return { clinics, doctors, active: true }
}
