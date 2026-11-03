type Value = string | boolean
type Field = [key: string, label: string]

const SECTIONS: { title: string; fields: Field[] }[] = [
  { title: 'About you', fields: [['name', 'Name'], ['dob', 'Date of birth'], ['countryOfResidence', 'Country of residence'], ['passportNationality', 'Passport nationality'], ['phone', 'Phone'], ['preferredLanguage', 'Preferred language']] },
  { title: 'Your health', fields: [['condition', 'Condition'], ['symptomsDuration', 'Symptoms'], ['pastTreatments', 'Past treatments'], ['medications', 'Medications'], ['allergies', 'Allergies'], ['otherConditions', 'Other conditions'], ['urgency', 'Urgency']] },
  { title: 'Care preferences', fields: [['destinations', 'Destinations'], ['doctorGender', 'Doctor gender'], ['doctorLanguage', 'Doctor language'], ['priority', 'Priority']] },
  { title: 'Travel', fields: [['departureCity', 'Departing from'], ['dateFlexibility', 'Date flexibility'], ['travelers', 'Travelers'], ['mobilityNeeds', 'Mobility needs'], ['recoveryLength', 'Recovery length'], ['visas', 'Visas'], ['passportValid', 'Passport valid']] },
  { title: 'Budget & coverage', fields: [['budget', 'Budget'], ['insurance', 'Insurance']] },
  { title: 'Records', fields: [['existingRecords', 'Existing records'], ['existingDoctors', 'Existing doctors']] },
]

const show = (value: Value) => (typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value)

type Props = { intake: Record<string, Value>; status: string; progress?: { collected: number; total: number } | null }

export function OnFileCard({ intake, status, progress }: Props) {
  const sections = SECTIONS.map((s) => ({ ...s, rows: s.fields.filter(([key]) => intake[key] != null && intake[key] !== '') })).filter((s) => s.rows.length > 0)
  return (
    <section aria-label="On file" className="border border-rule bg-velvet-deep/50 px-5 py-5 sm:px-7">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="font-display text-2xl text-cream italic">On file</h2>
        {status === 'intake' && progress && <p className="font-caslon text-xs tracking-[0.26em] text-mist uppercase">{progress.collected} of {progress.total} collected</p>}
      </div>
      {sections.map((s) => (
        <div key={s.title} className="mt-5">
          <h3 className="font-caslon text-xs tracking-[0.3em] text-champagne uppercase">{s.title}</h3>
          <dl className="mt-2 divide-y divide-rule text-sm">
            {s.rows.map(([key, label]) => (
              <div key={key} className="flex justify-between gap-6 py-2">
                <dt className="shrink-0 text-mist">{label}</dt>
                <dd className="text-right text-cream">{show(intake[key])}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
    </section>
  )
}
