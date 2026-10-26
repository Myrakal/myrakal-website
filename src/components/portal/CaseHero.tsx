import { STAGES } from './caseStages'
import { STATUS_COPY } from './statusCopy'

const ACTION_STATUSES = ['intake', 'plan_ready', 'awaiting_payment']

const pill = 'rounded-full border border-champagne/40 px-4 py-2 text-sm font-medium text-champagne hover:bg-champagne/10'
const primary = 'rounded-full bg-champagne px-4 py-2 text-sm font-medium text-velvet-deep hover:bg-champagne/90'

function actions(chatId: string, status: string) {
  if (status === 'intake') return [{ href: `/dashboard/${chatId}`, label: 'Continue conversation', primary: true }]
  if (status === 'plan_ready')
    return [
      { href: '#plan', label: 'Review your plan', primary: false },
      { href: '#approve', label: 'Approve', primary: true },
    ]
  if (status === 'awaiting_payment') return [{ href: '#payment', label: 'Go to payment', primary: true }]
  return []
}

export function CaseHero({ chatId, status }: { chatId: string; status: string }) {
  const stage = STAGES[status]
  return (
    <section
      aria-label="Case status"
      className="mt-6 flex flex-col gap-5 rounded-3xl border border-champagne/25 bg-velvet-deep px-6 py-6 shadow-2xl shadow-black/30 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-8"
    >
      <div className="min-w-0 sm:max-w-xl">
        <p className="font-grotesk text-[11px] tracking-[0.2em] text-champagne uppercase">
          {ACTION_STATUSES.includes(status) ? 'Action needed' : 'Nothing needed from you'}
        </p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl">{stage?.label ?? 'Your case'}</h2>
        <p className="mt-3 text-muted-foreground">{STATUS_COPY[status] ?? 'We are working on your case.'}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {actions(chatId, status).map((a) => (
          <a key={a.href} href={a.href} className={a.primary ? primary : pill}>
            {a.label}
          </a>
        ))}
      </div>
    </section>
  )
}
