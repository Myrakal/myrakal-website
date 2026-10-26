import { PLAN_STATUSES, formatUsd } from './statusCopy'

const PRE_APPROVAL = ['plan_ready', 'clarification_review']

export function PriceCard({ status, priceCents, paid }: { status: string; priceCents: number | null; paid: boolean }) {
  if (!PLAN_STATUSES.includes(status) || priceCents === null) return null
  return (
    <section aria-label="Your price" className="rounded-3xl bg-velvet-deep/50 px-5 py-5 sm:px-7">
      <h2 className="font-display text-xl text-champagne">Your price</h2>
      <p className="mt-3 font-display text-3xl">{formatUsd(priceCents)}</p>
      <p className="mt-1 text-sm text-muted-foreground">{paid ? 'Paid' : PRE_APPROVAL.includes(status) ? 'Due after you approve your plan' : 'Payment is due'}</p>
    </section>
  )
}
