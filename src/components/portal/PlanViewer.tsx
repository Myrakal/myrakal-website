'use client'

import { useEffect, useState } from 'react'

type State = { phase: 'loading' } | { phase: 'missing' } | { phase: 'error' } | { phase: 'ready'; url: string }

export function PlanViewer({ chatId }: { chatId: string }) {
  const [state, setState] = useState<State>({ phase: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/chats/${chatId}/plan`, { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 404) return setState({ phase: 'missing' })
        const body = await res.json()
        if (!res.ok || typeof body?.url !== 'string') throw new Error()
        setState({ phase: 'ready', url: body.url })
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ phase: 'error' })
      })
    return () => controller.abort()
  }, [chatId])

  if (state.phase === 'loading') return <p role="status" className="mt-6 text-sm">Loading your plan…</p>
  if (state.phase === 'missing') return <p role="status" className="mt-6 text-sm">Your plan is not available yet.</p>
  if (state.phase === 'error') {
    return (
      <p role="alert" className="mt-6 text-sm text-destructive">
        We could not load your plan. Please refresh the page.
      </p>
    )
  }
  return (
    <section aria-label="Your plan" className="mt-8">
      <h2 className="text-xl">Your plan</h2>
      <iframe title="Your plan" src={state.url} className="mt-4 h-[70vh] w-full rounded-2xl border border-border bg-card" />
      <a href={state.url} download="myrakal-plan.pdf" className="mt-3 inline-block text-sm font-medium underline underline-offset-4">
        Download your plan (PDF)
      </a>
    </section>
  )
}
