import {
  CalendarCheck,
  Check,
  ClipboardList,
  FileText,
  FlaskConical,
  Globe,
  Hotel,
  House,
  MessageCircle,
  Pill,
  ScanLine,
  ShieldCheck,
  Shuffle,
  Stethoscope,
  type LucideIcon,
} from 'lucide-react'

import { MockCard } from '@/components/MockCard'
import { ScrollSteps, type ScrollStep } from '@/components/ScrollSteps'

type Row = { name: string; icon: LucideIcon; status: string }

function RowList({ label, rows, selectable = false }: { label: string; rows: Row[]; selectable?: boolean }) {
  return (
    <MockCard label={label}>
      <ul className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <li
            key={row.name}
            className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 ${
              selectable && i === 0 ? 'border-primary bg-secondary' : 'border-border'
            }`}
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <row.icon className="size-5" aria-hidden="true" />
            </span>
            <span className="flex-1 text-lg font-medium">{row.name}</span>
            <span className="text-sm text-muted-foreground">{row.status}</span>
            {selectable && i === 0 ? <Check className="size-5 text-primary" role="img" aria-label="Selected" /> : null}
          </li>
        ))}
      </ul>
    </MockCard>
  )
}

const Intake = () => (
  <RowList
    label="Your intake"
    rows={[
      { name: 'Labs', icon: FlaskConical, status: 'Suggested' },
      { name: 'Imaging', icon: ScanLine, status: 'Suggested' },
      { name: 'Insurance plan', icon: ShieldCheck, status: 'Added' },
    ]}
  />
)

const Consult = () => (
  <RowList
    label="Doctor review"
    rows={[
      { name: 'Licensed doctor', icon: Stethoscope, status: 'Reviewing' },
      { name: 'Case summary', icon: ClipboardList, status: 'Ready' },
      { name: 'Approval or changes', icon: Check, status: 'Next' },
    ]}
  />
)

const Plan = () => (
  <RowList
    label="Your options"
    selectable
    rows={[
      { name: 'Close to home', icon: House, status: 'Nearby' },
      { name: 'Abroad', icon: Globe, status: 'Overseas' },
      { name: 'Hybrid', icon: Shuffle, status: 'Mix of both' },
    ]}
  />
)

const Coordinate = () => (
  <RowList
    label="Coordination"
    rows={[
      { name: 'Scheduling', icon: CalendarCheck, status: 'Booked' },
      { name: 'Documentation', icon: FileText, status: 'In review' },
      { name: 'Accommodations', icon: Hotel, status: 'Pending' },
      { name: 'Medication orders', icon: Pill, status: 'Pending' },
    ]}
  />
)

const FollowUp = () => (
  <RowList
    label="Aftercare"
    rows={[
      { name: 'Recovery check-in', icon: MessageCircle, status: 'Day 3' },
      { name: 'Doctor video call', icon: Stethoscope, status: 'Week 2' },
      { name: 'Follow-up visit', icon: CalendarCheck, status: 'Month 3' },
    ]}
  />
)

const STEPS: ScrollStep[] = [
  {
    title: 'Intake',
    description:
      'Come with or without a diagnosis. Our AI gathers your history and suggests the labs, imaging, and other tests to get, along with your insurance plan.',
    Mock: Intake,
  },
  {
    title: 'Consult',
    description: 'A licensed doctor reviews your case, then approves it or makes changes.',
    Mock: Consult,
  },
  {
    title: 'Plan',
    description:
      'We map out your options for care at home or abroad, and you choose the one that fits.',
    Mock: Plan,
  },
  {
    title: 'Coordinate',
    description:
      'We manage scheduling, documentation, logistics, and accommodations. We also handle medication orders, finding affordable credentialed domestic pharmacies and splitting fulfillment where needed.',
    Mock: Coordinate,
  },
  {
    title: 'Follow-up',
    description: 'Check-ins and aftercare once your treatment is done.',
    Mock: FollowUp,
  },
]

function Heading() {
  return (
    <div className="flex flex-col gap-6">
      <span className="text-base font-medium tracking-[0.2em] text-muted-foreground uppercase">
        How it works
      </span>
      <h2 className="text-4xl whitespace-nowrap sm:text-5xl lg:text-[2.75rem] xl:text-6xl 2xl:text-7xl">
        We make it simple.
      </h2>
      <p className="max-w-lg text-xl text-muted-foreground sm:text-2xl">
        Any care, at home or abroad, for less. We handle it from first labs to aftercare.
      </p>
    </div>
  )
}

export function HowItWorks() {
  return <ScrollSteps heading={<Heading />} steps={STEPS} />
}
