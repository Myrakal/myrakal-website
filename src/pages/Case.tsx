import { useEffect, useState } from 'react'
import wordmark from '@/assets/myrakal-wordmark.svg'
import { Button } from '@/components/ui/button'

export const CONSULT_PRICE_DISPLAY = '$150'

const SUPPORT = 'eshaansood@myrakal.com'
const POLL_MS = 3000
const POLL_MAX = 10
const STEPS = ['Intake', 'Payment', 'Doctor review', 'Decision']

type Status = 'awaiting_payment' | 'in_review' | 'approved' | 'changes_requested'
type CaseData = { status: Status; name: string | null; paid: boolean; note: string | null; reviewedAt: string | null }
type State = { kind: 'loading' } | { kind: 'missing' } | { kind: 'error' } | { kind: 'ready'; data: CaseData }

const current: Record<Status, number> = { awaiting_payment: 1, in_review: 2, approved: 4, changes_requested: 4 }

async function fetchCase(id: string): Promise<State> {
  try {
    const res = await fetch(`/api/case?id=${encodeURIComponent(id)}`)
    if (res.status === 404) return { kind: 'missing' }
    if (!res.ok) return { kind: 'error' }
    return { kind: 'ready', data: await res.json() }
  } catch {
    return { kind: 'error' }
  }
}

function Progress({ status }: { status: Status }) {
  const at = current[status]
  return (
    <ol aria-label="Progress" className="grid grid-cols-4 gap-2 text-xs sm:text-sm">
      {STEPS.map((s, i) => (
        <li key={s} aria-current={i === at - 1 || (at === 4 && i === 3) ? 'step' : undefined} className={`border-t-2 pt-2 ${i < at ? 'border-foreground font-medium' : 'border-border text-muted-foreground'}`}>
          {s}
        </li>
      ))}
    </ol>
  )
}

function Note({ data }: { data: CaseData }) {
  return (
    <>
      {data.note && <blockquote className="rounded-xl bg-muted/50 p-4 leading-7">{data.note}</blockquote>}
      {data.reviewedAt && (
        <p className="text-sm text-muted-foreground">Reviewed {new Date(data.reviewedAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</p>
      )}
    </>
  )
}

function Awaiting({ id }: { id: string }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function pay() {
    setBusy(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ intakeId: id }),
      })
      if (res.status === 503) throw new Error(`Payments are not available yet. Please email ${SUPPORT}.`)
      const body = res.ok ? await res.json() : null
      if (!body?.url) throw new Error('Something went wrong starting checkout. Please try again.')
      window.location.assign(body.url)
    } catch (err) {
      setError(err instanceof Error && err.message.startsWith('Payments') ? err.message : 'Something went wrong starting checkout. Please try again.')
      setBusy(false)
    }
  }

  return (
    <>
      <h1 className="font-heading text-3xl">One more step</h1>
      <p className="leading-7">
        A licensed doctor reviews your case for a consult fee of {CONSULT_PRICE_DISPLAY}, credited toward any treatment you choose.
      </p>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button size="lg" onClick={pay} disabled={busy}>Pay for consult</Button>
    </>
  )
}

function Body({ id, data, confirming }: { id: string; data: CaseData; confirming: boolean }) {
  if (data.status === 'awaiting_payment' && confirming) {
    return (
      <>
        <h1 className="font-heading text-3xl">Thanks{data.name ? `, ${data.name}` : ''}</h1>
        <p role="status">Confirming your payment...</p>
      </>
    )
  }
  if (data.status === 'awaiting_payment') return <Awaiting id={id} />
  if (data.status === 'in_review') {
    return (
      <>
        <h1 className="font-heading text-3xl">Your case is in review</h1>
        <p role="status" className="leading-7">Payment received. A licensed doctor is reviewing your case.</p>
      </>
    )
  }
  if (data.status === 'approved') {
    return (
      <>
        <h1 className="font-heading text-3xl">Your doctor approved your case</h1>
        <Note data={data} />
      </>
    )
  }
  return (
    <>
      <h1 className="font-heading text-3xl">Your doctor suggested changes</h1>
      <Note data={data} />
      <a href={`mailto:${SUPPORT}?subject=${encodeURIComponent(`Case ${id}`)}`} className="inline-block text-sm font-medium underline underline-offset-4">
        Email support
      </a>
    </>
  )
}

export default function Case() {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id') ?? ''
  const justPaid = params.get('paid') === '1'
  const [state, setState] = useState<State>(id ? { kind: 'loading' } : { kind: 'missing' })
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
      if (justPaid && waiting && attempts < POLL_MAX) {
        attempts += 1
        timer = setTimeout(run, POLL_MS)
      } else {
        setPolling(false)
      }
    }
    run()
    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [id, justPaid])

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="px-4 py-4 sm:px-8">
        <a href="/" aria-label="Myrakal home">
          <img src={wordmark} alt="" className="h-7 w-auto sm:h-9" />
        </a>
      </header>
      <main className="mx-auto w-full max-w-xl space-y-6 px-4 pb-16 pt-8 sm:px-8">
        {state.kind === 'loading' && <p role="status" className="text-muted-foreground">Loading your case...</p>}
        {state.kind === 'missing' && (
          <>
            <h1 className="font-heading text-3xl">Case not found</h1>
            <p role="alert">We couldn't find that case. Please check your link or email {SUPPORT}.</p>
          </>
        )}
        {state.kind === 'error' && <p role="alert">Something went wrong loading your case. Please refresh and try again.</p>}
        {state.kind === 'ready' && (
          <>
            <Progress status={state.data.status} />
            <Body id={id} data={state.data} confirming={polling} />
          </>
        )}
      </main>
    </div>
  )
}
