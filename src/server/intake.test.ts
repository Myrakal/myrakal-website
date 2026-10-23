import { INTAKE_FIELDS, REQUIRED_KEYS, UPDATE_INTAKE_TOOL, intakeProgress, pickIntakeFields } from './intake'

const fullIntake = () =>
  Object.fromEntries(
    INTAKE_FIELDS.filter((f) => f.required).map((f) => [f.key, f.type === 'boolean' ? true : 'x']),
  )

describe('intake fields', () => {
  it('defines required and optional fields with unique keys', () => {
    const keys = INTAKE_FIELDS.map((f) => f.key)
    expect(new Set(keys).size).toBe(keys.length)
    expect(REQUIRED_KEYS.length).toBeGreaterThan(20)
    expect(INTAKE_FIELDS.filter((f) => !f.required).map((f) => f.key)).toEqual(['existingRecords', 'existingDoctors'])
  })
})

describe('intakeProgress', () => {
  it('is zero for an empty intake', () => {
    expect(intakeProgress({})).toEqual({ collected: 0, total: REQUIRED_KEYS.length })
  })

  it('counts filled required fields only', () => {
    expect(intakeProgress({ name: 'Ada', dob: '1990-01-01', existingDoctors: 'Dr X' }).collected).toBe(2)
  })

  it('ignores blank strings, false booleans and unknown keys', () => {
    expect(intakeProgress({ name: '   ', consent: false, nope: 'x' }).collected).toBe(0)
    expect(intakeProgress({ passportValid: false }).collected).toBe(1)
  })

  it('reaches total when every required field is filled', () => {
    const { collected, total } = intakeProgress(fullIntake())
    expect(collected).toBe(total)
  })

  it('tolerates non-object intake', () => {
    expect(intakeProgress(null).collected).toBe(0)
    expect(intakeProgress('x').collected).toBe(0)
  })
})

describe('pickIntakeFields', () => {
  it('keeps known fields with the right type and trims strings', () => {
    expect(pickIntakeFields({ name: ' Ada ', consent: true })).toEqual({ name: 'Ada', consent: true })
  })

  it('drops unknown keys, wrong types and empty values', () => {
    expect(pickIntakeFields({ name: 5, consent: 'yes', phone: '', hack: 'x' })).toEqual({})
  })

  it('keeps passportValid false but drops consent false', () => {
    expect(pickIntakeFields({ passportValid: false, consent: false })).toEqual({ passportValid: false })
  })

  it('caps string length', () => {
    expect(String(pickIntakeFields({ name: 'a'.repeat(5000) }).name)).toHaveLength(2000)
  })

  it('returns an empty object for non-objects', () => {
    expect(pickIntakeFields(undefined)).toEqual({})
  })
})

describe('UPDATE_INTAKE_TOOL', () => {
  it('exposes every field in its input schema with no required keys', () => {
    expect(UPDATE_INTAKE_TOOL.name).toBe('update_intake')
    expect(Object.keys(UPDATE_INTAKE_TOOL.input_schema.properties)).toEqual(INTAKE_FIELDS.map((f) => f.key))
    expect(UPDATE_INTAKE_TOOL.input_schema.type).toBe('object')
    expect(UPDATE_INTAKE_TOOL.input_schema.additionalProperties).toBe(false)
  })
})
