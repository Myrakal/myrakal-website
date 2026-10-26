import { STAGES, STEPS } from './caseStages'

export function CaseJourney({ status }: { status: string }) {
  const stage = STAGES[status]
  if (!stage) return null
  return (
    <section aria-label="Your journey" className="mt-4 rounded-3xl border border-border bg-velvet-deep/40 px-6 py-5 sm:px-8">
      <div className="flex items-baseline justify-between">
        <h2 className="font-display text-xl">Your journey</h2>
        <p className="text-sm text-muted-foreground">
          Step {stage.step + 1} of {STEPS.length}
        </p>
      </div>
      <ol className="mt-4 grid grid-cols-6 gap-1.5">
        {STEPS.map((name, i) => {
          const state = i < stage.step ? 'done' : i === stage.step ? 'current' : 'todo'
          return (
            <li key={name} aria-current={state === 'current' ? 'step' : undefined} className="flex flex-col gap-2">
              <span className={`h-1.5 rounded-full ${state === 'todo' ? 'bg-border' : state === 'done' ? 'bg-champagne/60' : 'bg-champagne'}`} />
              <span className={`text-xs leading-tight max-sm:sr-only ${state === 'current' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
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
