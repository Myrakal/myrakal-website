import { useState } from 'react'
import wordmark from '@/assets/myrakal-wordmark.svg'
import { Button } from '@/components/ui/button'
import { summarize, type Message } from '@/lib/caseSummary'

type Intake = { id: string; createdAt: string; name: string | null; email: string; transcript: Message[] }

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

function Case({ intake }: { intake: Intake }) {
  const { history, tests, insurance } = summarize(intake.transcript)
  const missing = <p className="text-muted-foreground">Not provided</p>
  const text = (v: string) => (v ? <p>{v}</p> : missing)
  return (
    <article className="space-y-8 rounded-2xl border border-border p-6 sm:p-8">
      <header>
        <h2 className="font-heading text-3xl">{intake.name ?? 'Name not given'}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{intake.email} · Submitted {when(intake.createdAt)}</p>
      </header>
      <Field label="Symptoms and history">{history.length ? history.map((h, i) => <p key={i}>{h}</p>) : missing}</Field>
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
      if (!res.ok) throw new Error(String(res.status))
      setIntakes(await res.json())
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
                  aria-current={i === selected}
                  onClick={() => setSelected(i)}
                  className="shrink-0 rounded-xl border border-border px-4 py-3 text-left text-sm aria-[current=true]:border-foreground aria-[current=true]:bg-muted"
                >
                  <span className="block font-medium">{p.name ?? p.email}</span>
                  <span className="block text-muted-foreground">{when(p.createdAt)}</span>
                </button>
              ))}
            </nav>
            {intakes[selected] && <Case intake={intakes[selected]} />}
          </div>
        )}
      </main>
    </div>
  )
}
