import { STAGES, STEPS } from './caseStages'

export function CaseJourney({ status }: { status: string }) {
  const stage = STAGES[status]
  if (!stage) return null
  return (
    <section aria-label="Your journey" className="mt-4 border border-rule bg-velvet-deep/40 px-6 py-5 sm:px-8">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-2xl text-cream italic">Your journey</h2>
        <p className="font-caslon text-xs tracking-[0.26em] text-mist uppercase">
          Step {stage.step + 1} of {STEPS.length}
        </p>
      </div>
      <ol className="mt-4 grid grid-cols-6 gap-1.5">
        {STEPS.map((name, i) => {
          const state = i < stage.step ? 'done' : i === stage.step ? 'current' : 'todo'
          return (
            <li key={name} aria-current={state === 'current' ? 'step' : undefined} className="flex flex-col gap-2">
              <span className={`h-0.5 ${state === 'todo' ? 'bg-mist/25' : state === 'done' ? 'bg-champagne/60' : 'bg-champagne'}`} />
              <span className={`font-caslon text-[10px] leading-tight tracking-[0.2em] uppercase max-sm:sr-only ${state === 'current' ? 'text-champagne' : 'text-mist'}`}>
                {name}
                <span className="sr-only">{state === 'done' ? 'Completed' : state === 'todo' ? 'Upcoming' : null}</span>
              </span>
            </li>
          )
        })}
      </ol>
    </section>
  )
}
