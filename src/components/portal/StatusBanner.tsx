import { STATUS_COPY } from '@/components/portal/statusCopy'

const STEPS = ['Conversation', 'Doctor review', 'Your plan', 'Payment', 'Reservations', 'Booked']

const STAGES: Record<string, { label: string; step: number }> = {
  intake: { label: 'In conversation', step: 0 },
  doctor_review: { label: 'With our doctors', step: 1 },
  plan_ready: { label: 'Plan ready', step: 2 },
  clarification_review: { label: 'Plan under review', step: 2 },
  awaiting_payment: { label: 'Awaiting payment', step: 3 },
  reservations: { label: 'Booking in progress', step: 4 },
  booked: { label: 'Booked', step: 5 },
}

export function StatusBanner({ chatId, status }: { chatId: string; status: string }) {
  const stage = STAGES[status]
  return (
    <section aria-label="Case status" className="mt-6 rounded-3xl border border-champagne/25 bg-velvet-deep/50 px-5 py-5 shadow-2xl shadow-black/30 sm:px-7">
      <p className="font-grotesk text-[11px] tracking-[0.2em] text-champagne uppercase">Status</p>
      {stage && <p className="mt-1 font-display text-2xl sm:text-3xl">{stage.label}</p>}
      <p className="mt-2 text-muted-foreground">{STATUS_COPY[status] ?? 'We are working on your case.'}</p>
      {status === 'intake' && (
        <a href={`/chat?id=${chatId}`} className="mt-3 inline-block font-medium text-champagne underline underline-offset-4">
          Continue your conversation
        </a>
      )}
      {stage && (
        <>
        <ol className="mt-5 grid grid-cols-6 gap-1.5">
          {STEPS.map((name, i) => {
            const state = i < stage.step ? 'done' : i === stage.step ? 'current' : 'todo'
            return (
              <li key={name} aria-current={state === 'current' ? 'step' : undefined} className="flex flex-col gap-1.5">
                <span className={`h-1 rounded-full ${state === 'todo' ? 'bg-border' : 'bg-champagne'}`} />
                <span className={`text-xs leading-tight max-sm:sr-only ${state === 'current' ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {name}
                  <span className="sr-only">{state === 'done' ? 'Completed' : state === 'todo' ? 'Upcoming' : null}</span>
                </span>
              </li>
            )
          })}
        </ol>
        <p className="mt-2 text-xs text-muted-foreground sm:hidden">
          Step {stage.step + 1} of {STEPS.length}: {STEPS[stage.step]}
        </p>
        </>
      )}
    </section>
  )
}
