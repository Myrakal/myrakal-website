import { PLAN_STATUSES, formatUsd } from './statusCopy'

const PRE_APPROVAL = ['plan_ready', 'clarification_review']

export function PriceCard({ status, priceCents, paid }: { status: string; priceCents: number | null; paid: boolean }) {
  if (!PLAN_STATUSES.includes(status) || priceCents === null) return null
  return (
    <section aria-label="Your price" className="border border-rule bg-velvet-deep/50 px-5 py-5 sm:px-7">
      <h2 className="font-display text-2xl text-cream italic">Your price</h2>
      <p className="mt-3 font-display text-4xl text-cream">{formatUsd(priceCents)}</p>
      <p className="mt-1 font-caslon text-xs tracking-[0.26em] text-mist uppercase">{paid ? 'Paid' : PRE_APPROVAL.includes(status) ? 'Due after you approve your plan' : 'Payment is due'}</p>
    </section>
  )
}
