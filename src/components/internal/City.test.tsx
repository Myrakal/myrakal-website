import { readFileSync } from 'node:fs'
import { isValidElement, Suspense, type ReactElement } from 'react'

import { buildCity } from '@/lib/internal/city'
import type { RawGraph } from '@/lib/internal/types'
import City from './City'

type El = ReactElement<Record<string, any>>

function flatten(node: unknown): El[] {
  if (!isValidElement(node)) return Array.isArray(node) ? node.flatMap(flatten) : []
  const el = node as El
  return [el, ...flatten(el.props.children)]
}

const raw: RawGraph = {
  providers: [
    { id: 'p1', slug: 'a', name: 'Alpha', kind: 'hospital' },
    { id: 'p2', slug: 'b', name: 'Beta', kind: 'clinic' },
  ] as any,
  doctors: [{ id: 'd1', slug: 'd', name: 'Dr One', specialty: null }] as any,
  affiliations: [
    { id: 'a1', doctor_id: 'd1', provider_id: 'p1', role: null },
    { id: 'a2', doctor_id: 'd1', provider_id: 'p2', role: null },
  ],
  procedures: [],
  prices: [],
}

const city = buildCity(raw)
const withProp = (parts: El[], key: string) => parts.filter((p) => p.props[key])
const inner = (el: El) => (el.type as any).type(el.props) as El

describe('City', () => {
  it('renders a ground, every clinic, every doctor and every link', () => {
    const parts = flatten(City({ city, hover: null, setHover: jest.fn() }))
    expect(withProp(parts, 'clinic')).toHaveLength(2)
    expect(withProp(parts, 'doctor')).toHaveLength(1)
    expect(parts.filter((p) => p.props.points && p.props.lineWidth === 1.4)).toHaveLength(city.links.length)
    expect(parts.some((p) => p.props.extent === city.extent)).toBe(true)
  })

  it('highlights hovered clinic, its doctors and dims others', () => {
    const [c1] = city.clinics
    const parts = flatten(City({ city, hover: { type: 'clinic', id: c1.id }, setHover: jest.fn() }))
    const clinics = withProp(parts, 'clinic')
    expect(clinics.find((p) => p.props.clinic.id === c1.id)!.props).toMatchObject({ hot: true, dim: false })
    expect(clinics.find((p) => p.props.clinic.id !== c1.id)!.props).toMatchObject({ hot: false, dim: true })
    expect(withProp(parts, 'doctor')[0].props.hot).toBe(true)
  })

  it('highlights the active link while hovering a doctor', () => {
    const parts = flatten(City({ city, hover: { type: 'doctor', id: 'd1' }, setHover: jest.fn() }))
    const link = parts.find((p) => p.props.points && p.props.lineWidth === 3)!
    expect(link.props).toMatchObject({ opacity: 0.9 })
  })

  it('sets and clears hover from pointer events', () => {
    const setHover = jest.fn()
    const parts = flatten(City({ city, hover: null, setHover }))
    const group = inner(withProp(parts, 'clinic')[0])
    const stopPropagation = jest.fn()
    group.props.onPointerOver({ stopPropagation })
    expect(setHover).toHaveBeenCalledWith({ type: 'clinic', id: city.clinics[0].id })
    expect(stopPropagation).toHaveBeenCalled()
    group.props.onPointerOut()
    expect(setHover).toHaveBeenLastCalledWith(null)
    const dg = inner(withProp(parts, 'doctor')[0])
    dg.props.onPointerOver({ stopPropagation })
    expect(setHover).toHaveBeenLastCalledWith({ type: 'doctor', id: 'd1' })
  })

  it('draws clinic labels with Text and no Html', () => {
    const src = readFileSync(`${__dirname}/City.tsx`, 'utf8')
    expect(src).not.toMatch(/\bHtml\b/)
    const parts = flatten(City({ city, hover: null, setHover: jest.fn() }))
    const pad = inner(withProp(parts, 'clinic')[0])
    const label = flatten(pad).find((p) => p.props.font)!
    expect(label.props.children).toBe(city.clinics[0].name.toUpperCase())
    expect(label.props.font).toBe('/fonts/label.woff')
  })

  it('dims the label of non-hovered clinics', () => {
    const [c1] = city.clinics
    const parts = flatten(City({ city, hover: { type: 'clinic', id: c1.id }, setHover: jest.fn() }))
    const other = withProp(parts, 'clinic').find((p) => p.props.clinic.id !== c1.id)!
    const label = flatten(inner(other)).find((p) => p.props.font)!
    expect(label.props.fillOpacity).toBe(0.35)
  })

  it('wraps each label in its own Suspense with no fallback', () => {
    const parts = flatten(City({ city, hover: null, setHover: jest.fn() }))
    const pad = inner(withProp(parts, 'clinic')[0])
    const boundary = flatten(pad).find((p) => p.type === Suspense)!
    expect(boundary.props.fallback).toBeNull()
    expect(flatten(boundary.props.children).some((p) => p.props.font)).toBe(true)
  })

  it('keeps the label out of raycasting so it cannot steal hover', () => {
    const parts = flatten(City({ city, hover: null, setHover: jest.fn() }))
    const label = flatten(inner(withProp(parts, 'clinic')[0])).find((p) => p.props.font)!
    expect(label.props.raycast()).toBeNull()
  })

  it('stubs Billboard for the r3f mock', () => {
    expect(typeof require('../../../tests/r3f-stub').Billboard).toBe('function')
  })
})
