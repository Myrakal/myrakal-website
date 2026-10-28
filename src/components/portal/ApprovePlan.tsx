'use client'

import { useEffect, useRef, useState } from 'react'

type Props = { chatId: string; status: string; onApproved: (status: string) => void }

export function ApprovePlan({ chatId, status, onApproved }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [blocked, setBlocked] = useState(false)
  const [moved, setMoved] = useState(false)
  const inFlight = useRef(false)
  const approveButton = useRef<HTMLButtonElement>(null)
  const confirmButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!moved) return
    ;(confirming ? confirmButton : approveButton).current?.focus()
  }, [confirming, moved])

  if (status !== 'plan_ready') return null

  const approve = async () => {
    if (inFlight.current) return
    inFlight.current = true
    setSending(true)
    setError(null)
    let res: Response
    try {
      res = await fetch(`/api/chats/${chatId}/approve`, { method: 'POST' })
    } catch {
      setError('We could not approve your plan. Please try again.')
      setSending(false)
      inFlight.current = false
      return
    }
    setSending(false)
    inFlight.current = false
    if (res.status === 409 || res.status === 401) {
      setBlocked(true)
      return setError(
        res.status === 409 ? 'Your plan can no longer be approved. Please refresh the page.' : 'Your session has ended. Please sign in again.',
      )
    }
    if (!res.ok) return setError('We could not approve your plan. Please try again.')
    const body = await res.json().catch(() => null)
    onApproved(typeof body?.status === 'string' ? body.status : 'awaiting_payment')
  }

  return (
    <section id="approve" aria-label="Approve your plan" className="mt-10 border-t border-rule pt-8">
      <h2 className="font-display text-3xl text-cream italic">Happy with the plan?</h2>
      <p className="mt-3 text-sm text-mist">Approving moves you on to payment. If you want changes first, send your comments above.</p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        {confirming ? (
          <>
            <button type="button" onClick={approve} disabled={sending || blocked} ref={confirmButton} className="border border-champagne/85 bg-champagne px-10 py-3.5 font-caslon text-xs tracking-[0.28em] text-ink uppercase transition-colors hover:bg-transparent hover:text-champagne focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne disabled:pointer-events-none disabled:opacity-50">
              {sending ? 'Approving…' : 'Confirm approval'}
            </button>
            <button type="button" onClick={() => setConfirming(false)} disabled={sending} className="border border-champagne/85 px-10 py-3.5 font-caslon text-xs tracking-[0.28em] text-champagne uppercase transition-colors hover:bg-champagne hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne disabled:pointer-events-none disabled:opacity-50">
              Cancel
            </button>
          </>
        ) : (
          <button
            type="button"
            ref={approveButton}
            className="border border-champagne/85 bg-champagne px-10 py-3.5 font-caslon text-xs tracking-[0.28em] text-ink uppercase transition-colors hover:bg-transparent hover:text-champagne focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne disabled:pointer-events-none disabled:opacity-50"
            onClick={() => {
              setMoved(true)
              setConfirming(true)
            }}
          >
            Approve plan
          </button>
        )}
      </div>
    </section>
  )
}
