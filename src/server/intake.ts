type FieldType = 'string' | 'boolean'

type IntakeField = { key: string; type: FieldType; required: boolean; description: string; mustBeTrue?: boolean }
type IntakeQuestion = { text: string; keys: string[] }

const MAX_TEXT = 2000

const text = (key: string, description: string, required = true): IntakeField => ({ key, type: 'string', required, description })
const flag = (key: string, description: string, mustBeTrue = false): IntakeField => ({ key, type: 'boolean', required: true, description, mustBeTrue })

export const INTAKE_FIELDS: IntakeField[] = [
  text('condition', 'What the patient wants help with, including a diagnosis if known'),
  text('symptomsDuration', 'Symptoms and how long they have lasted'),
  flag('emergency', 'True if the patient reports an emergency now; false if they explicitly say no'),
  text('name', 'Name the patient wants to be called'),
  text('dob', 'Date of birth'),
  text('pastTreatments', 'Past treatments, procedures or surgery, including explicit none'),
  text('medications', 'Current medications, including explicit none'),
  text('allergies', 'Allergies, including explicit none'),
  text('otherConditions', 'Other health conditions, including explicit none'),
  text('existingRecords', 'Recent test results, scans or doctor notes, including explicit none'),
]

export const INTAKE_QUESTIONS: IntakeQuestion[] = [
  { text: 'What would you like help with? If you already have a diagnosis, you can share it. If not, just tell me what has been bothering you.', keys: ['condition'] },
  { text: 'What symptoms or changes have you noticed, and how long have they been going on?', keys: ['symptomsDuration'] },
  { text: 'Before we continue, does anything feel like an emergency right now—such as chest pain, trouble breathing, signs of a stroke, severe bleeding, or thoughts of harming yourself?', keys: ['emergency'] },
  { text: 'What should we call you, and what’s your date of birth?', keys: ['name', 'dob'] },
  { text: 'Have you already tried any treatments, procedures, or surgery for this? It’s completely okay if the answer is no.', keys: ['pastTreatments'] },
  { text: 'To help the doctor review this safely, are you taking any medications, and do you have any allergies or other health conditions?', keys: ['medications', 'allergies', 'otherConditions'] },
  { text: 'Do you have any recent test results, scans, or doctor’s notes that you could share later? No problem if you don’t.', keys: ['existingRecords'] },
]

export const REQUIRED_KEYS = INTAKE_FIELDS.filter((f) => f.required).map((f) => f.key)

const FIELD_BY_KEY = new Map(INTAKE_FIELDS.map((f) => [f.key, f]))

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isFilled = (value: unknown, field?: IntakeField) => {
  if (typeof value === 'string') return value.trim() !== ''
  return typeof value === 'boolean' && (value || !field?.mustBeTrue)
}

export function intakeProgress(intake: unknown) {
  const data = isRecord(intake) ? intake : {}
  const collected = INTAKE_QUESTIONS.filter((question) =>
    question.keys.every((key) => isFilled(data[key], FIELD_BY_KEY.get(key))),
  ).length
  return { collected, total: INTAKE_QUESTIONS.length }
}

export function pickIntakeFields(input: unknown) {
  const picked: Record<string, string | boolean> = {}
  if (!isRecord(input)) return picked
  for (const [key, value] of Object.entries(input)) {
    const field = FIELD_BY_KEY.get(key)
    if (!field || typeof value !== field.type || !isFilled(value, field)) continue
    picked[key] = typeof value === 'string' ? value.trim().slice(0, MAX_TEXT) : (value as boolean)
  }
  return picked
}

export const UPDATE_INTAKE_TOOL = {
  name: 'update_intake',
  description: 'Record intake information the patient just shared. Include only fields learned this turn.',
  input_schema: {
    type: 'object' as const,
    properties: Object.fromEntries(INTAKE_FIELDS.map((f) => [f.key, { type: f.type, description: f.description }])),
    additionalProperties: false,
  },
}
