'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { ChatMessage, type Message } from '@/components/chat/ChatMessage'
import { PortalShell } from '@/components/portal/PortalShell'
import { STATUS_COPY } from '@/components/portal/statusCopy'

type Detail = { id: string; status: string; messages: Message[] }
type State = { phase: 'loading' } | { phase: 'error'; text: string } | { phase: 'ready'; chat: Detail }

export default function ChatPortal() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [state, setState] = useState<State>({ phase: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/chats/${id}`, { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) return router.replace('/login')
        if (res.status === 404) return setState({ phase: 'error', text: 'We could not find this case.' })
        const chat: Detail = await res.json()
        if (!res.ok || !Array.isArray(chat.messages)) throw new Error()
        setState({ phase: 'ready', chat })
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ phase: 'error', text: 'We could not load this case. Please refresh the page.' })
      })
    return () => controller.abort()
  }, [id, router])

  return (
    <PortalShell title="Your case">
      <a href="/dashboard" className="mt-2 inline-block text-sm underline underline-offset-4">
        ← Your chats
      </a>
      {state.phase === 'loading' && <p role="status" className="mt-6 text-sm">Loading your case…</p>}
      {state.phase === 'error' && (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {state.text}
        </p>
      )}
      {state.phase === 'ready' && (
        <>
          <section role="status" aria-label="Case status" className="mt-6 rounded-2xl border border-border bg-card px-5 py-4 text-card-foreground">
            <p className="mb-1 text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase">Status</p>
            <p>{STATUS_COPY[state.chat.status]}</p>
            {state.chat.status === 'intake' && (
              <a href={`/chat?id=${state.chat.id}`} className="mt-3 inline-block font-medium underline underline-offset-4">
                Continue your conversation
              </a>
            )}
          </section>
          <div role="log" aria-label="Conversation" className="mt-8 flex flex-col gap-4">
            {state.chat.messages.map((m) => (
              <ChatMessage key={m.id} message={m} />
            ))}
          </div>
        </>
      )}
    </PortalShell>
  )
}
