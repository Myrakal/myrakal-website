'use client'

import { useEffect, useState } from 'react'

type State = { phase: 'loading' } | { phase: 'missing' } | { phase: 'error' } | { phase: 'ready'; url: string }

const REFRESH_MS = 240_000

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

  const [linkUrl, setLinkUrl] = useState<string | null>(null)

  useEffect(() => {
    if (state.phase !== 'ready') return
    const timer = setInterval(() => {
      fetch(`/api/chats/${chatId}/plan`)
        .then(async (res) => (res.ok ? res.json() : null))
        .then((body) => typeof body?.url === 'string' && setLinkUrl(body.url))
        .catch(() => undefined)
    }, REFRESH_MS)
    return () => clearInterval(timer)
  }, [chatId, state.phase])

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
      <iframe title="Plan PDF preview" src={state.url} className="mt-4 h-[70vh] w-full rounded-2xl border border-border bg-card" />
      <a href={linkUrl ?? state.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm font-medium underline underline-offset-4">
        Open or download your plan (PDF)
      </a>
    </section>
  )
}
