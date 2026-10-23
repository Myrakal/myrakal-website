'use client'

import { useEffect, useRef, useState } from 'react'

import { Button } from '@/components/ui/button'

type Props = {
  chatId: string
  status: string
  priceCents: number | null
  returned: boolean
  onStatus: (status: string) => void
  onRedirect?: (url: string) => void
}

const POLL_MS = 3000
const MAX_POLLS = 20

const goTo = (url: string) => window.location.assign(url)

export function PayPlan({ chatId, status, priceCents, returned, onStatus, onRedirect = goTo }: Props) {
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [blocked, setBlocked] = useState(false)
  const [gaveUp, setGaveUp] = useState(false)
  const inFlight = useRef(false)
  const waiting = status === 'awaiting_payment' && returned

  useEffect(() => {
    if (!waiting) return
    let polls = 0
    const timer = setInterval(async () => {
      polls += 1
      const body = await fetch(`/api/chats/${chatId}`)
        .then((res) => (res.ok ? res.json() : null))
        .catch(() => null)
      if (typeof body?.status === 'string' && body.status !== 'awaiting_payment') {
        clearInterval(timer)
        onStatus(body.status)
        return
      }
      if (polls >= MAX_POLLS) {
        clearInterval(timer)
        setGaveUp(true)
      }
    }, POLL_MS)
    return () => clearInterval(timer)
  }, [waiting, chatId, onStatus])

  if (status !== 'awaiting_payment') return null

  if (waiting) {
    return (
      <section aria-label="Payment" className="mt-8">
        <p role="status" className="text-sm">
          {gaveUp
            ? 'Your payment is taking longer than usual to confirm. Please refresh the page in a minute. You will not be charged twice.'
            : 'Thank you. We are confirming your payment…'}
        </p>
      </section>
    )
  }

  const pay = async () => {
    if (inFlight.current) return
    inFlight.current = true
    setSending(true)
    setError(null)
    const fail = (text: string, lock = false) => {
      setError(text)
      setBlocked(lock)
      setSending(false)
      inFlight.current = false
    }
    let res: Response
    try {
      res = await fetch(`/api/chats/${chatId}/checkout`, { method: 'POST' })
    } catch {
      return fail('We could not start your payment. Please try again.')
    }
    if (res.status === 409) return fail('Your plan is not ready for payment. Please refresh the page.', true)
    if (res.status === 401) return fail('Your session has ended. Please sign in again.', true)
    const body = res.ok ? await res.json().catch(() => null) : null
    if (typeof body?.url !== 'string') return fail('We could not start your payment. Please try again.')
    onRedirect(body.url)
  }

  const label = priceCents === null ? 'Pay now' : `Pay $${(priceCents / 100).toFixed(2)}`

  return (
    <section aria-label="Payment" className="mt-8">
      <h2 className="text-xl">Ready to book?</h2>
      <p className="mt-2 text-sm">Your payment covers all reservation costs. You will pay securely with Stripe.</p>
      {error && (
        <p role="alert" className="mt-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="button" onClick={pay} disabled={sending || blocked} className="mt-4">
        {sending ? 'Redirecting…' : label}
      </Button>
    </section>
  )
}
