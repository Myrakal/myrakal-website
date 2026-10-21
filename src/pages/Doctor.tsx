import { useState } from 'react'
import wordmark from '@/assets/myrakal-wordmark.svg'
import { Button } from '@/components/ui/button'
import { summarize, type Message } from '@/lib/caseSummary'

type Intake = {
  id: string
  createdAt: string
  name: string | null
  email: string
  transcript: Message[]
  consultStatus: string
  paidAt: string | null
  consultNote: string | null
  reviewedAt: string | null
}
type Decision = Pick<Intake, 'consultStatus' | 'consultNote' | 'reviewedAt'>

const STATUS: Record<string, string> = {
  awaiting_payment: 'Awaiting payment',
  in_review: 'In review',
  approved: 'Approved',
  changes_requested: 'Changes requested',
}
const statusLabel = (s: string) => STATUS[s] ?? s

const when = (iso: string) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">{label}</h3>
      <div className="space-y-2 leading-7">{children}</div>
    </section>
  )
}

function Decide({ id, token, onDone }: { id: string; token: string; onDone: (d: Decision) => void }) {
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(decision: 'approved' | 'changes_requested') {
    if (decision === 'changes_requested' && !note.trim()) return setError('Add a note explaining the changes you need.')
    setError('')
    setBusy(true)
    try {
      const res = await fetch('/api/intakes', {
        method: 'POST',
        headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify({ id, decision, note: note.trim() }),
      })
      if (!res.ok) throw new Error(String(res.status))
      onDone(await res.json())
    } catch (err) {
      setError(err instanceof Error && err.message === '409' ? 'This case is no longer awaiting review.' : 'Could not save your decision. Please try again.')
      setBusy(false)
    }
  }

  return (
    <section className="space-y-3">
      <label className="block space-y-1.5 text-sm font-medium">
        Note to patient
        <textarea value={note} onChange={(e) => setNote(e.target.value)} maxLength={4000} rows={4} className="w-full rounded-lg border border-input bg-background p-3 text-base" />
      </label>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <div className="flex flex-wrap gap-2">
        <Button type="button" disabled={busy} onClick={() => submit('approved')}>Approve</Button>
        <Button type="button" variant="outline" disabled={busy} onClick={() => submit('changes_requested')}>Request changes</Button>
      </div>
    </section>
  )
}

function Case({ intake, token, onDecided }: { intake: Intake; token: string; onDecided: (d: Decision) => void }) {
  const { history, tests, insurance } = summarize(intake.transcript)
  const text = (v: string) => (v ? <p>{v}</p> : <p className="text-muted-foreground">Not provided</p>)
  return (
    <article className="space-y-8 rounded-2xl border border-border p-6 sm:p-8">
      <header>
        <h2 className="font-heading text-3xl">{intake.name ?? 'Name not given'}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{intake.email} · Submitted {when(intake.createdAt)}</p>
        <p role="status" className="mt-3 text-sm">
          <b className="rounded-full bg-muted px-3 py-1">{statusLabel(intake.consultStatus)}</b>
          {intake.consultNote && <span className="mt-2 block leading-6">{intake.consultNote}</span>}
        </p>
      </header>
      <Field label="Symptoms and history">{history.length ? history.map((h, i) => <p key={i}>{h}</p>) : text('')}</Field>
      <Field label="Labs and imaging">{text(tests)}</Field>
      <Field label="Insurance">{text(insurance)}</Field>
      <details className="rounded-xl bg-muted/50 p-4">
        <summary className="cursor-pointer text-sm font-medium">Full conversation</summary>
        <ul className="mt-4 space-y-3 text-sm">
          {intake.transcript.map((m, i) => (
            <li key={i}><b>{m.role === 'user' ? 'Patient' : 'Assistant'}: </b>{m.text}</li>
          ))}
        </ul>
      </details>
      {intake.consultStatus === 'in_review' && <Decide id={intake.id} token={token} onDone={onDecided} />}
    </article>
  )
}

export default function Doctor() {
  const [token, setToken] = useState('')
  const [intakes, setIntakes] = useState<Intake[] | null>(null)
  const [selected, setSelected] = useState(0)
  const [error, setError] = useState('')

  async function load(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/intakes', { headers: { authorization: `Bearer ${token}` } })
      const body = res.ok ? await res.json() : null
      if (!Array.isArray(body)) throw new Error(String(res.status))
      setIntakes(body)
    } catch (err) {
      setError(err instanceof Error && err.message === '401' ? 'That token was not accepted. Please try again.' : 'Could not load patients. Please try again.')
    }
  }

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="px-4 py-4 sm:px-8">
        <a href="/" aria-label="Myrakal home">
          <img src={wordmark} alt="" className="h-7 w-auto sm:h-9" />
        </a>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-8">
        {!intakes ? (
          <form onSubmit={load} className="mx-auto mt-16 max-w-sm space-y-4">
            <h1 className="font-heading text-3xl">Patient intakes</h1>
            <label className="block space-y-1.5 text-sm font-medium">
              Access token
              <input type="password" value={token} onChange={(e) => setToken(e.target.value)} className="h-10 w-full rounded-lg border border-input bg-background px-3 text-base" />
            </label>
            {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
            <Button type="submit" size="lg" disabled={!token}>View patients</Button>
          </form>
        ) : !intakes.length ? (
          <p className="mt-16 text-center text-muted-foreground">No patients yet.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-[18rem_1fr]">
            <nav aria-label="Patients" className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
              {intakes.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={i === selected}
                  onClick={() => setSelected(i)}
                  className="shrink-0 rounded-xl border border-border px-4 py-3 text-left text-sm aria-pressed:border-foreground aria-pressed:bg-muted"
                >
                  <span className="block font-medium">{p.name ?? p.email}</span>
                  <span className="block text-muted-foreground">{when(p.createdAt)}</span>
                  <span className="mt-1 block text-xs font-medium">{statusLabel(p.consultStatus)}</span>
                </button>
              ))}
            </nav>
            {intakes[selected] && <Case
                key={intakes[selected].id}
                intake={intakes[selected]}
                token={token}
                onDecided={(d) => setIntakes(intakes.map((p, i) => (i === selected ? { ...p, ...d } : p)))}
              />}
          </div>
        )}
      </main>
    </div>
  )
}
