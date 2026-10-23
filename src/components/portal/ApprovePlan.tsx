'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'

type Props = { chatId: string; status: string; onApproved: (status: string) => void }

export function ApprovePlan({ chatId, status, onApproved }: Props) {
  const [confirming, setConfirming] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (status !== 'plan_ready') return null

  const approve = async () => {
    setSending(true)
    setError(null)
    let res: Response
    try {
      res = await fetch(`/api/chats/${chatId}/approve`, { method: 'POST' })
    } catch {
      setError('We could not approve your plan. Please try again.')
      setSending(false)
      return
    }
    setSending(false)
    if (res.status === 409) return setError('Your plan can no longer be approved. Please refresh the page.')
    if (res.status === 401) return setError('Your session has ended. Please sign in again.')
    if (!res.ok) return setError('We could not approve your plan. Please try again.')
    const body = await res.json().catch(() => null)
    onApproved(typeof body?.status === 'string' ? body.status : 'awaiting_payment')
  }

  return (
    <section aria-label="Approve your plan" className="mt-8">
      <h2 className="text-xl">Happy with the plan?</h2>
      <p className="mt-2 text-sm">Approving moves you on to payment. If you want changes first, send your comments above.</p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        {confirming ? (
          <>
            <Button type="button" onClick={approve} disabled={sending}>
              {sending ? 'Approving…' : 'Confirm approval'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setConfirming(false)} disabled={sending}>
              Cancel
            </Button>
          </>
        ) : (
          <Button type="button" onClick={() => setConfirming(true)}>
            Approve plan
          </Button>
        )}
      </div>
    </section>
  )
}
