export const REQUIRED_INTAKE_FIELDS = [
  'name',
  'dob',
  'countryOfResidence',
  'passportNationality',
  'phone',
  'preferredLanguage',
  'condition',
  'symptoms',
  'pastTreatments',
  'medications',
  'allergies',
  'otherConditions',
  'urgency',
  'destinations',
  'doctorPreferences',
  'priority',
  'departureCity',
  'dateFlexibility',
  'travelers',
  'mobilityNeeds',
  'recoveryLength',
  'budget',
  'insurance',
  'visas',
  'passportValid',
  'consent',
] as const

const filled = (value: unknown) => {
  if (value === null || value === undefined) return false
  if (typeof value === 'string') return value.trim().length > 0
  if (Array.isArray(value)) return value.length > 0
  return true
}

export function intakeProgress(intake: unknown) {
  const record = intake && typeof intake === 'object' ? (intake as Record<string, unknown>) : {}
  return {
    collected: REQUIRED_INTAKE_FIELDS.filter((key) => filled(record[key])).length,
    total: REQUIRED_INTAKE_FIELDS.length,
  }
}
