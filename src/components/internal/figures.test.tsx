import { isValidElement, type ReactElement } from 'react'

import { CHAMPAGNE, DIM_EDGE, GOLD } from './palette'
import { Block, Windows } from './primitives'
import { DoctorFigure, FillerBlock, Tree } from './figures'

type El = ReactElement<Record<string, any>>

function flatten(node: unknown): El[] {
  if (!isValidElement(node)) return Array.isArray(node) ? node.flatMap(flatten) : []
  const el = node as El
  return [el, ...flatten(el.props.children)]
}

describe('FillerBlock', () => {
  it('renders a dim block and windows sized from its height', () => {
    const parts = flatten(FillerBlock({ h: 4.4, w: 2 }))
    const block = parts.find((p) => p.type === Block)!
    expect(block.props).toMatchObject({ position: [0, 2.2, 0], size: [2, 4.4, 2], color: '#1c0a0e', edge: DIM_EDGE })
    const windows = parts.find((p) => p.type === Windows)!
    expect(windows.props).toMatchObject({ rows: 4, glass: '#5a2029', edge: DIM_EDGE })
  })

  it('never renders fewer than one window row', () => {
    const windows = flatten(FillerBlock({ h: 0.2, w: 1 })).find((p) => p.type === Windows)!
    expect(windows.props.rows).toBe(1)
  })
})

describe('Tree', () => {
  it('renders a trunk and a cone', () => {
    expect(flatten(Tree()).filter((p) => p.type === 'mesh')).toHaveLength(2)
  })
})

describe('DoctorFigure', () => {
  const ring = (hot: boolean) => {
    const meshes = flatten(DoctorFigure({ hot })).filter((p) => p.type === 'mesh')
    return meshes.find((m) => flatten(m).some((c) => c.type === 'ringGeometry'))!
  }

  it('scales the whole figure by 1.35', () => {
    expect((DoctorFigure({}) as El).props.scale).toBe(1.35)
  })

  it('highlights the ring when hot', () => {
    expect(ring(true).props.scale).toBe(1.35)
    const material = (hot: boolean) => flatten(ring(hot)).find((c) => c.type === 'meshBasicMaterial')!
    expect(material(true).props.color).toBe(CHAMPAGNE)
    expect(material(false).props.color).toBe(GOLD)
  })
})
