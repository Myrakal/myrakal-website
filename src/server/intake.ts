type FieldType = 'string' | 'boolean'

type IntakeField = { key: string; type: FieldType; required: boolean; description: string; mustBeTrue?: boolean }

const MAX_TEXT = 2000

const text = (key: string, description: string, required = true): IntakeField => ({ key, type: 'string', required, description })
const flag = (key: string, description: string, mustBeTrue = false): IntakeField => ({ key, type: 'boolean', required: true, description, mustBeTrue })

export const INTAKE_FIELDS: IntakeField[] = [
  text('name', 'Full legal name'),
  text('dob', 'Date of birth'),
  text('countryOfResidence', 'Country of residence'),
  text('passportNationality', 'Passport nationality'),
  text('phone', 'Phone number'),
  text('preferredLanguage', 'Preferred language'),
  text('condition', 'Condition or treatment goal'),
  text('symptomsDuration', 'Symptoms and how long they have lasted'),
  text('pastTreatments', 'Past treatments and surgeries'),
  text('medications', 'Current medications'),
  text('allergies', 'Allergies'),
  text('otherConditions', 'Other medical conditions'),
  text('urgency', 'How urgent the care is'),
  text('destinations', 'Preferred destinations, or open to any'),
  text('doctorGender', 'Preferred doctor gender, or no preference'),
  text('doctorLanguage', 'Preferred doctor language'),
  text('priority', 'Top priority: cost, wait time or reputation'),
  text('departureCity', 'Departure city'),
  text('dateFlexibility', 'Flexibility on travel dates'),
  text('travelers', 'Number of travelers and companions'),
  text('mobilityNeeds', 'Mobility needs'),
  text('recoveryLength', 'Expected recovery length'),
  text('budget', 'Budget range'),
  text('insurance', 'Insurance plan, or none'),
  text('visas', 'Visas held'),
  flag('passportValid', 'True if the passport is valid for at least 6 more months, false if not'),
  flag('consent', 'True once the patient agrees the AI is not medical advice and a doctor will review the case', true),
  text('existingRecords', 'Existing medical records', false),
  text('existingDoctors', 'Doctors already seen', false),
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
  return { collected: REQUIRED_KEYS.filter((key) => isFilled(data[key], FIELD_BY_KEY.get(key))).length, total: REQUIRED_KEYS.length }
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
