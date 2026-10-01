import { Users, Wallet } from 'lucide-react'
import { animate, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

// TODO: placeholder figures. Replace with real, sourced stats before launch.
const DESTINATIONS = [
  { name: 'Dubai', patientsPerYear: 12400, avgSpend: 6800, reason: 'its premium private hospitals and fast access to specialists' },
  { name: 'Mexico', patientsPerYear: 38600, avgSpend: 3900, reason: 'its short travel from the US, lower prices, and short wait times' },
  { name: 'Turkey', patientsPerYear: 27300, avgSpend: 4600, reason: 'its affordable dental, cosmetic, and surgical care' },
  { name: 'India', patientsPerYear: 21800, avgSpend: 5200, reason: 'its highly trained specialists and affordable complex surgeries' },
  { name: 'Thailand', patientsPerYear: 16900, avgSpend: 5700, reason: 'its internationally accredited hospitals and hospitality-style care' },
]

const MAX_PATIENTS = Math.max(...DESTINATIONS.map((d) => d.patientsPerYear))

const formatNumber = (value: number) => Math.round(value).toLocaleString('en-US')
const formatUsd = (value: number) => `$${formatNumber(value)}`
const formatUsdCompact = (value: number) =>
  `$${new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(Math.round(value))}`

function Counter({
  value,
  format,
  instant,
}: {
  value: number
  format: (value: number) => string
  instant: boolean
}) {
  const [display, setDisplay] = useState(value)
  const shown = useRef(value)

  useEffect(() => {
    if (instant) return
    const controls = animate(shown.current, value, {
      duration: 0.7,
      ease: 'easeOut',
      onUpdate: (latest) => {
        shown.current = latest
        setDisplay(latest)
      },
    })
    return () => controls.stop()
  }, [value, instant])

  return <>{format(instant ? value : display)}</>
}

export function DemandExplorer() {
  const reduceMotion = useReducedMotion() ?? false
  const [selected, setSelected] = useState(0)
  const destination = DESTINATIONS[selected]
  const revenue = destination.patientsPerYear * destination.avgSpend

  return (
    <div className="relative w-full max-w-lg">
      <div className="rounded-3xl border border-border bg-background p-6 shadow-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Where is your care center?
          </span>
        </div>

        <div className="mb-8 flex flex-wrap gap-2" role="group" aria-label="Destination">
          {DESTINATIONS.map((d, i) => (
            <button
              key={d.name}
              type="button"
              aria-pressed={i === selected}
              onClick={() => setSelected(i)}
              className={`cursor-pointer rounded-full border px-4 py-2 text-base font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                i === selected
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border text-foreground hover:bg-secondary'
              }`}
            >
              {d.name}
            </button>
          ))}
        </div>

        <div className="mb-6 flex flex-col gap-1">
          <span className="text-sm text-muted-foreground">
            Yearly revenue opportunity in {destination.name}
          </span>
          <span
            className="text-5xl font-medium text-foreground tabular-nums"
            aria-hidden="true"
          >
            <Counter value={revenue} format={formatUsdCompact} instant={reduceMotion} />
          </span>
        </div>

        <div className="mb-6">
          <div className="h-2 overflow-hidden rounded-full bg-secondary" aria-hidden="true">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out motion-reduce:transition-none"
              style={{ width: `${(destination.patientsPerYear / MAX_PATIENTS) * 100}%` }}
            />
          </div>
          <span className="mt-2 block text-sm text-muted-foreground">
            Patients come to {destination.name} for {destination.reason}.
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-border px-4 py-3.5">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="size-4" aria-hidden="true" />
              Patients per year
            </dt>
            <dd className="mt-1 text-2xl font-medium tabular-nums" aria-hidden="true">
              <Counter
                value={destination.patientsPerYear}
                format={formatNumber}
                instant={reduceMotion}
              />
            </dd>
          </div>
          <div className="rounded-2xl border border-border px-4 py-3.5">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <Wallet className="size-4" aria-hidden="true" />
              Avg. spend per patient
            </dt>
            <dd className="mt-1 text-2xl font-medium tabular-nums" aria-hidden="true">
              <Counter
                value={destination.avgSpend}
                format={formatUsd}
                instant={reduceMotion}
              />
            </dd>
          </div>
        </dl>

        <p className="sr-only" aria-live="polite">
          {destination.name}: {formatNumber(destination.patientsPerYear)} patients per year,{' '}
          {formatUsd(destination.avgSpend)} average spend, {formatUsdCompact(revenue)} yearly
          revenue opportunity.
        </p>
      </div>
    </div>
  )
}
