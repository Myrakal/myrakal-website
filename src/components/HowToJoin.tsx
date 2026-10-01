import { Check, Mail, Phone } from 'lucide-react'

import { MockCard } from '@/components/MockCard'
import { ScrollSteps, type ScrollStep } from '@/components/ScrollSteps'

const ACCREDITATIONS = [
  { short: 'JCI', name: 'Joint Commission International' },
  { short: 'DNV', name: 'DNV Healthcare (NIAHO)' },
  { short: 'ACHSI', name: 'Australian Council on Healthcare Standards International' },
  { short: 'Qmentum', name: 'Accreditation Canada International' },
  { short: 'NABH', name: 'National Accreditation Board for Hospitals (India)' },
  { short: 'HA', name: 'Hospital Accreditation, Thailand (HAI)' },
  { short: 'CSG', name: 'Consejo de Salubridad General (Mexico)' },
  { short: 'TEMOS', name: 'Medical travel quality certification' },
]

const ROW = 'flex items-center gap-4 rounded-2xl border px-4 py-3.5'
const DOT =
  'flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground'

function Connect() {
  return (
    <MockCard label="Two ways in">
      <ul className="flex flex-col gap-3">
        <li className={`${ROW} border-primary bg-secondary`}>
          <span className={DOT}>
            <Mail className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-medium">You reach out</span>
            <span className="text-sm text-muted-foreground">
              Email us and tell us about your hospital.
            </span>
          </div>
        </li>
        <li className={`${ROW} border-border`}>
          <span className={DOT}>
            <Phone className="size-5" aria-hidden="true" />
          </span>
          <div className="flex flex-col">
            <span className="text-lg font-medium">We reach out</span>
            <span className="text-sm text-muted-foreground">
              We message hospitals we think would be a great fit.
            </span>
          </div>
        </li>
      </ul>
    </MockCard>
  )
}

function Checklist({ label, items }: { label: string; items: string[] }) {
  return (
    <MockCard label={label}>
      <ul className="flex flex-col gap-3">
        {items.map((item, i) => (
          <li
            key={item}
            className={`${ROW} ${i === 0 ? 'border-primary bg-secondary' : 'border-border'}`}
          >
            <span className={DOT}>
              <Check className="size-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-medium">{item}</span>
          </li>
        ))}
      </ul>
    </MockCard>
  )
}

function IntroCall() {
  return (
    <Checklist
      label="On the call"
      items={[
        'Your hospital and specialties',
        'The patients you want to see',
        'How bookings and payment work',
        'Whether it is a fit for both sides',
      ]}
    />
  )
}

function Verification() {
  return (
    <MockCard label="What we verify">
      <p className="mb-3 text-sm text-muted-foreground">
        Accreditations we would consider, plus patient reviews and track record.
      </p>
      <ul className="divide-y divide-border border-y border-border">
        {ACCREDITATIONS.map((item) => (
          <li key={item.short} className="flex items-baseline gap-4 py-2 text-sm">
            <span className="w-16 shrink-0 font-medium text-foreground">{item.short}</span>
            <span className="text-muted-foreground">{item.name}</span>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-sm text-muted-foreground">
        Other recognized programs are reviewed case by case.
      </p>
    </MockCard>
  )
}

function Onboarding() {
  return (
    <Checklist
      label="Paperwork and setup"
      items={[
        'Partnership agreement',
        'Hospital profile and specialties',
        'Billing and payout details',
        'A dedicated point of contact',
      ]}
    />
  )
}

function StartEarning() {
  return (
    <Checklist
      label="Once you are live"
      items={[
        'No upfront cost',
        'Patients book through Myrakal',
        'We only get paid per booked patient',
        'Support from our team throughout',
      ]}
    />
  )
}

const STEPS: ScrollStep[] = [
  {
    title: 'Connect',
    description: 'You reach out to us, or we message you.',
    Mock: Connect,
  },
  {
    title: 'Intro call',
    description: "We get on a call to see if there's a fit.",
    Mock: IntroCall,
  },
  {
    title: 'Verification',
    description: 'We look at your accreditation, patient reviews, and track record.',
    Mock: Verification,
  },
  {
    title: 'Onboarding',
    description: 'We handle the paperwork, contracts, and setup together.',
    Mock: Onboarding,
  },
  {
    title: 'Start earning',
    description: 'Patients start booking, and you start making money.',
    Mock: StartEarning,
  },
]

function Heading() {
  return (
    <div className="flex flex-col gap-6">
      <span className="text-base font-medium tracking-[0.2em] text-muted-foreground uppercase">
        How to join
      </span>
      <h2 className="text-4xl font-medium sm:text-5xl xl:text-6xl">
        From hello to earning.
      </h2>
      <p className="max-w-lg text-xl text-muted-foreground sm:text-2xl">
        We&rsquo;re starting with a small, carefully chosen group of hospitals.
      </p>
    </div>
  )
}

export function HowToJoin() {
  return <ScrollSteps heading={<Heading />} steps={STEPS} className="bg-secondary" />
}
