import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from 'motion/react'
import { useRef, useState, type ReactNode } from 'react'

export type ScrollStep = {
  title: string
  description: string
  Mock: () => React.JSX.Element
  ghost?: boolean
}

function StepText({
  step,
  index,
  active = true,
}: {
  step: ScrollStep
  index: number
  active?: boolean
}) {
  const ghost = step.ghost
  return (
    <div
      className={`flex gap-6 transition-opacity duration-300 ${
        active ? (ghost ? 'opacity-70' : 'opacity-100') : 'opacity-35'
      }`}
    >
      <span
        className={`flex size-12 shrink-0 items-center justify-center rounded-full text-lg ${
          ghost
            ? 'border-2 border-dashed border-muted-foreground text-muted-foreground'
            : 'bg-primary text-primary-foreground'
        }`}
      >
        {index + 1}
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="flex min-h-12 flex-wrap items-center gap-x-3 text-2xl font-medium">
          {step.title}
          {ghost ? (
            <span className="rounded-full border border-border px-2.5 py-0.5 text-xs font-medium tracking-wider uppercase">
              Coming soon
            </span>
          ) : null}
        </h3>
        <div
          className={`grid transition-[grid-template-rows] duration-300 ${
            active ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <p className="overflow-hidden text-xl text-muted-foreground">
            {step.description}
          </p>
        </div>
      </div>
    </div>
  )
}

export function ScrollSteps({
  heading,
  steps,
  className = 'bg-secondary',
}: {
  heading: ReactNode
  steps: ScrollStep[]
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })

  useMotionValueEvent(scrollYProgress, 'change', (progress) => {
    const next = Math.min(steps.length - 1, Math.floor(progress * steps.length))
    setActive((current) => (current === next ? current : next))
  })

  const ActiveMock = steps[active].Mock

  return (
    <section className={className}>
      <div
        ref={ref}
        className="hidden lg:block"
        style={{ height: `${steps.length * 90}vh` }}
      >
        <div className="sticky top-0 flex h-screen items-center px-12">
          <div className="mx-auto grid w-full max-w-[100rem] grid-cols-2 items-center gap-20">
            <div className="flex flex-col gap-14">
              {heading}
              <ol className="flex flex-col gap-6">
                {steps.map((step, i) => (
                  <li key={step.title} aria-current={i === active ? 'step' : undefined}>
                    <StepText step={step} index={i} active={i === active} />
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
        {heading}
        <ol className="flex flex-col gap-16">
          {steps.map((step, i) => {
            const Mock = step.Mock
            return (
              <li key={step.title} className="flex flex-col gap-8">
                <StepText step={step} index={i} />
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
