import { isValidElement, type ReactElement } from 'react'

import { ClinicBuilding, Clinic, Hospital, Imaging, Specialty, Surgery } from './buildings'

const kinds = [
  ['hospital', Hospital],
  ['clinic', Clinic],
  ['imaging_center', Imaging],
  ['surgery_center', Surgery],
  ['specialty_clinic', Specialty],
] as const

describe('ClinicBuilding', () => {
  it.each(kinds)('maps %s to its building', (kind, Comp) => {
    const el = ClinicBuilding({ kind, hot: false }) as ReactElement
    expect(isValidElement(el)).toBe(true)
    expect(el.type).toBe(Comp)
  })

  it.each([null, 'unknown', 'constructor', 'toString', '__proto__'])('falls back to Clinic for %s', (kind) => {
    expect((ClinicBuilding({ kind, hot: true }) as ReactElement).type).toBe(Clinic)
  })

  it.each(kinds)('%s renders children', (_kind, Comp) => {
    expect((Comp({ hot: false }) as ReactElement<{ children?: unknown }>).props.children).toBeDefined()
  })

  it('wraps in a scaled group when given a scale', () => {
    const el = ClinicBuilding({ kind: 'hospital', hot: false, scale: { w: 1.2, h: 2 } }) as ReactElement<{ scale: number[] }>
    expect(el.type).toBe('group')
    expect(el.props.scale).toEqual([1.2, 2, 1.2])
  })

  it('adds a wing to a grand hospital', () => {
    const count = (grand: boolean) =>
      (Hospital({ hot: false, grand }) as ReactElement<{ children: unknown[] }>).props.children.filter(Boolean).length
    expect(count(true)).toBeGreaterThan(count(false))
  })

  it.each(kinds)('%s stays on the platform at max width', (_kind, Comp) => {
    const parts = (Comp({ hot: false, grand: true }) as ReactElement<{ children: unknown }>).props.children
    const boxes = (Array.isArray(parts) ? parts : [parts]).filter(
      (e): e is ReactElement<{ position: number[]; size: number[] }> => !!e && !!(e as ReactElement<{ size?: number[] }>).props?.size,
    )
    const far = Math.max(
      ...boxes.flatMap(({ props: { position: [x, , z], size: [w, , d] } }) =>
        [-1, 1].flatMap((a) => [-1, 1].map((b) => Math.hypot((x + (a * w) / 2) * 1.35, (z + (b * d) / 2) * 1.35))),
      ),
    )
    expect(far).toBeLessThanOrEqual(5.3)
  })
})
