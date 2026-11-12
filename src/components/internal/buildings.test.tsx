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

  it.each([null, 'unknown'])('falls back to Clinic for %s', (kind) => {
    expect((ClinicBuilding({ kind, hot: true }) as ReactElement).type).toBe(Clinic)
  })

  it.each(kinds)('%s renders children', (_kind, Comp) => {
    expect((Comp({ hot: false }) as ReactElement<{ children?: unknown }>).props.children).toBeDefined()
  })
})
