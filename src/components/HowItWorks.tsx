import { BadgeCheck, Bone, Check, HeartPulse, ShieldCheck, Smile, Star } from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react'
import { useRef, useState, type ReactNode } from 'react'

const STEPS = [
  {
    title: 'Select your country',
    description:
      "Choose where you'd like to receive care, based on where you're eligible to go.",
  },
  {
    title: 'Select your doctor',
    description: "Browse vetted specialists and pick who's right for you.",
  },
]

const COUNTRIES = [
  { name: 'Mexico', code: 'MX' },
  { name: 'Turkey', code: 'TR' },
  { name: 'India', code: 'IN' },
  { name: 'Thailand', code: 'TH' },
]

const SPECIALTIES = [
  { name: 'Orthopedic surgery', icon: Bone, rating: '4.9' },
  { name: 'Cardiology', icon: HeartPulse, rating: '4.8' },
  { name: 'Dental care', icon: Smile, rating: '5.0' },
]

function MockCard({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="w-full max-w-lg rounded-3xl border border-border bg-background p-6 shadow-xl sm:p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {label}
        </span>
        <span className="text-xs text-muted-foreground">Illustrative preview</span>
      </div>
      {children}
    </div>
  )
}

function CountryPicker() {
  return (
    <MockCard label="Where to?">
      <ul className="flex flex-col gap-3">
        {COUNTRIES.map((country, i) => {
          const selected = i === 0
          return (
            <li
              key={country.code}
              className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 ${
                selected ? 'border-primary bg-secondary' : 'border-border'
              }`}
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                {country.code}
              </span>
              <span className="flex-1 text-lg font-medium">{country.name}</span>
              {selected ? (
                <Check className="size-5 text-primary" aria-label="Selected" />
              ) : null}
            </li>
          )
        })}
      </ul>
    </MockCard>
  )
}

function DoctorPicker() {
  return (
    <MockCard label="Specialties">
      <ul className="flex flex-col gap-3">
        {SPECIALTIES.map((specialty, i) => {
          const selected = i === 0
          return (
            <li
              key={specialty.name}
              className={`flex items-center gap-4 rounded-2xl border px-4 py-3.5 ${
                selected ? 'border-primary bg-secondary' : 'border-border'
              }`}
            >
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <specialty.icon className="size-5" aria-hidden="true" />
              </span>
              <div className="flex flex-1 flex-col">
                <span className="text-lg font-medium">{specialty.name}</span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Star className="size-3.5 fill-primary text-primary" aria-hidden="true" />
                  <span className="font-medium text-foreground">{specialty.rating}</span>
                  rated by locals
                </span>
              </div>
              {selected ? (
                <Check className="size-5 text-primary" aria-label="Selected" />
              ) : null}
            </li>
          )
        })}
      </ul>
      <div className="mt-6 flex flex-wrap gap-2 text-xs font-medium text-primary">
        <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
          <BadgeCheck className="size-3.5" aria-hidden="true" />
          Board-certified doctors
        </span>
        <span className="flex items-center gap-1 rounded-full bg-secondary px-3 py-1">
          <ShieldCheck className="size-3.5" aria-hidden="true" />
          Accredited hospitals
        </span>
      </div>
    </MockCard>
  )
}

const MOCKS = [CountryPicker, DoctorPicker]

function StepText({
  index,
  active = true,
}: {
  index: number
  active?: boolean
}) {
  const step = STEPS[index]
  return (
    <div
      className={`flex gap-6 transition-opacity duration-300 ${
        active ? 'opacity-100' : 'opacity-35'
      }`}
    >
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg text-primary-foreground">
        {index + 1}
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl font-medium">{step.title}</h3>
        <p className="text-xl text-muted-foreground">{step.description}</p>
      </div>
    </div>
  )
}

function Heading() {
  return (
    <div className="flex flex-col gap-6">
      <span className="text-base font-medium tracking-[0.2em] text-muted-foreground uppercase">
        How it works
      </span>
      <h2 className="text-5xl font-medium sm:text-6xl lg:text-7xl">
        Care made <span className="italic">simple.</span>
      </h2>
      <p className="max-w-lg text-xl text-muted-foreground sm:text-2xl">
        We get you the most reputed doctors in the country you choose.
      </p>
    </div>
  )
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const next = Math.min(STEPS.length - 1, Math.floor(progress * STEPS.length))
    setActive((current) => (current === next ? current : next))
  })

  const ActiveMock = MOCKS[active]

  return (
    <section className="bg-secondary">
      <div ref={ref} className="hidden h-[220vh] lg:block">
        <div className="sticky top-0 flex h-screen items-center px-12">
          <div className="mx-auto grid w-full max-w-[100rem] grid-cols-2 items-center gap-20">
            <div className="flex flex-col gap-14">
              <Heading />
              <ol className="flex flex-col gap-10">
                {STEPS.map((step, i) => (
                  <li key={step.title} aria-current={i === active ? 'step' : undefined}>
                    <StepText index={i} active={i === active} />
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="flex w-full justify-center"
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                >
                  <ActiveMock />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-16 px-6 py-20 sm:px-12 lg:hidden">
        <Heading />
        <ol className="flex flex-col gap-16">
          {STEPS.map((step, i) => {
            const Mock = MOCKS[i]
            return (
              <li key={step.title} className="flex flex-col gap-8">
                <StepText index={i} />
                <div className="flex justify-center">
                  <Mock />
                </div>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
