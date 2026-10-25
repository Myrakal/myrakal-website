import { INTAKE_FIELDS, INTAKE_QUESTIONS, REQUIRED_KEYS, UPDATE_INTAKE_TOOL, intakeProgress, pickIntakeFields } from './intake'

const fullIntake = () =>
  Object.fromEntries(
    INTAKE_FIELDS.filter((f) => f.required).map((f) => [f.key, f.type === 'boolean' ? true : 'x']),
  )

describe('intake fields', () => {
  it('defines seven questions backed by required fields with unique keys', () => {
    const keys = INTAKE_FIELDS.map((f) => f.key)
    expect(new Set(keys).size).toBe(keys.length)
    expect(INTAKE_QUESTIONS).toHaveLength(7)
    expect(REQUIRED_KEYS).toEqual(keys)
    expect(INTAKE_QUESTIONS.flatMap((q) => q.keys)).toEqual(keys)
  })
})

describe('intakeProgress', () => {
  it('is zero for an empty intake', () => {
    expect(intakeProgress({})).toEqual({ collected: 0, total: 7 })
  })

  it('counts completed questions rather than individual fields', () => {
    expect(intakeProgress({ name: 'Ada' }).collected).toBe(0)
    expect(intakeProgress({ name: 'Ada', dob: '1990-01-01' }).collected).toBe(1)
  })

  it('ignores blank strings and unknown keys but counts an explicit no to the emergency question', () => {
    expect(intakeProgress({ name: '   ', nope: 'x' }).collected).toBe(0)
    expect(intakeProgress({ emergency: false }).collected).toBe(1)
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
    expect(pickIntakeFields({ name: ' Ada ', emergency: false })).toEqual({ name: 'Ada', emergency: false })
  })

  it('drops unknown keys, wrong types and empty values', () => {
    expect(pickIntakeFields({ name: 5, emergency: 'no', medications: '', hack: 'x' })).toEqual({})
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
