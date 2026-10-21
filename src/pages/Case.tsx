import { useEffect, useState } from 'react'
import wordmark from '@/assets/myrakal-wordmark.svg'
import { Button } from '@/components/ui/button'

export const CONSULT_PRICE_DISPLAY = '$150'

const SUPPORT = 'eshaansood@myrakal.com'
const POLL_MS = 3000
const POLL_MAX = 10
const STEPS = ['Intake', 'Payment', 'Doctor review', 'Decision']
const CHECKOUT_ERROR = 'Something went wrong starting checkout. Please try again.'
const NO_PAYMENTS = `Payments are not available yet. Please email ${SUPPORT}.`

type Status = 'awaiting_payment' | 'in_review' | 'approved' | 'changes_requested'
type CaseData = { status: Status; name: string | null; paid: boolean; note: string | null; reviewedAt: string | null }
type State = { kind: 'loading' | 'missing' | 'error' } | { kind: 'ready'; data: CaseData }

const reached: Record<Status, number> = { awaiting_payment: 2, in_review: 3, approved: 4, changes_requested: 4 }
const H1 = 'font-heading text-3xl'

async function fetchCase(id: string): Promise<State> {
  try {
    const res = await fetch(`/api/case?id=${encodeURIComponent(id)}`)
    if (res.status === 404) return { kind: 'missing' }
    return res.ok ? { kind: 'ready', data: await res.json() } : { kind: 'error' }
  } catch { return { kind: 'error' } }
}

function Progress({ status }: { status: Status }) {
  const at = reached[status]
  return (
    <ol aria-label="Progress" className="grid grid-cols-4 gap-2 text-xs sm:text-sm">
      {STEPS.map((s, i) => (
        <li key={s} aria-current={i === at - 1 ? 'step' : undefined} className={`border-t-2 pt-2 ${i < at ? 'border-foreground font-medium' : 'border-border text-muted-foreground'}`}>{s}</li>
      ))}
    </ol>
  )
}

function Awaiting({ id }: { id: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function pay() {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ intakeId: id }) })
      if (res.status === 503) return setError(NO_PAYMENTS)
      const body = res.ok ? await res.json() : null
      if (!body?.url) return setError(CHECKOUT_ERROR)
      window.location.assign(body.url)
    } catch { setError(CHECKOUT_ERROR) } finally { setBusy(false) }
  }

  return (
    <>
      <h1 className={H1}>One more step</h1>
      <p className="leading-7">A licensed doctor reviews your case for a consult fee of {CONSULT_PRICE_DISPLAY}, credited toward any treatment you choose.</p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button size="lg" onClick={pay} disabled={busy}>Pay for consult</Button>
    </>
  )
}

function Body({ id, data, confirming }: { id: string; data: CaseData; confirming: boolean }) {
  if (data.status === 'awaiting_payment') {
    if (!confirming) return <Awaiting id={id} />
    return <><h1 className={H1}>Thanks{data.name ? `, ${data.name}` : ''}</h1><p role="status">Confirming your payment...</p></>
  }
  if (data.status === 'in_review') {
    return <><h1 className={H1}>Your case is in review</h1><p role="status" className="leading-7">Payment received. A licensed doctor is reviewing your case.</p></>
  }
  const approved = data.status === 'approved'
  return (
    <>
      <h1 className={H1}>{approved ? 'Your doctor approved your case' : 'Your doctor suggested changes'}</h1>
      {data.note && <blockquote className="rounded-xl bg-muted/50 p-4 leading-7">{data.note}</blockquote>}
      {data.reviewedAt && <p className="text-sm text-muted-foreground">Reviewed {new Date(data.reviewedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>}
      {!approved && <a href={`mailto:${SUPPORT}?subject=${encodeURIComponent(`Case ${id}`)}`} className="inline-block text-sm font-medium underline underline-offset-4">Email support</a>}
    </>
  )
}

export default function Case() {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id') ?? ''
  const justPaid = params.get('paid') === '1'
  const [state, setState] = useState<State>({ kind: id ? 'loading' : 'missing' })
  const [polling, setPolling] = useState(justPaid)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    let attempts = 0
    let timer: ReturnType<typeof setTimeout>
    const run = async () => {
      const next = await fetchCase(id)
      if (cancelled) return
      setState(next)
      const waiting = next.kind === 'ready' && next.data.status === 'awaiting_payment'
      if (justPaid && waiting && attempts++ < POLL_MAX) timer = setTimeout(run, POLL_MS)
      else setPolling(false)
    }
    run()
    return () => { cancelled = true; clearTimeout(timer) }
  }, [id, justPaid])

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="px-4 py-4 sm:px-8">
        <a href="/" aria-label="Myrakal home"><img src={wordmark} alt="" className="h-7 w-auto sm:h-9" /></a>
      </header>
      <main className="mx-auto w-full max-w-xl space-y-6 px-4 pb-16 pt-8 sm:px-8">
        {state.kind === 'loading' && <p role="status" className="text-muted-foreground">Loading your case...</p>}
        {state.kind === 'missing' && <><h1 className={H1}>Case not found</h1><p role="alert">We couldn't find that case. Please check your link or email {SUPPORT}.</p></>}
        {state.kind === 'error' && <p role="alert">Something went wrong loading your case. Please refresh and try again.</p>}
        {state.kind === 'ready' && <><Progress status={state.data.status} /><Body id={id} data={state.data} confirming={polling} /></>}
      </main>
    </div>
  )
}
