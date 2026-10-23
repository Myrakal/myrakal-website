import { intakeProgress, REQUIRED_INTAKE_FIELDS } from './intake-progress'

describe('intakeProgress', () => {
  it('counts zero for empty or invalid intake', () => {
    const total = REQUIRED_INTAKE_FIELDS.length
    expect(intakeProgress({})).toEqual({ collected: 0, total })
    expect(intakeProgress(null)).toEqual({ collected: 0, total })
    expect(intakeProgress('x')).toEqual({ collected: 0, total })
  })

  it('counts only filled required fields', () => {
    expect(intakeProgress({ name: 'Ada', phone: '  ', allergies: [], consent: true, unknown: 'x', symptoms: null })).toEqual({
      collected: 2,
      total: REQUIRED_INTAKE_FIELDS.length,
    })
  })

  it('does not count false or empty objects as filled', () => {
    expect(intakeProgress({ consent: false, passportValid: false, medications: {} }).collected).toBe(0)
    expect(intakeProgress({ consent: true, travelers: 0 }).collected).toBe(2)
  })

  it('reaches total when everything is filled', () => {
    const full = Object.fromEntries(REQUIRED_INTAKE_FIELDS.map((key) => [key, 'x']))
    const { collected, total } = intakeProgress(full)
    expect(collected).toBe(total)
  })
})
