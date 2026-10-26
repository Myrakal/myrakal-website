'use client'

import { useRouter } from 'next/navigation'
import { type ReactNode, useEffect, useRef, useState } from 'react'

import { ChatMessage, type Message } from '@/components/chat/ChatMessage'
import { ApprovePlan } from './ApprovePlan'
import { CaseHeader } from './CaseHeader'
import { CaseHero } from './CaseHero'
import { CaseJourney } from './CaseJourney'
import { CommentSection, type PlanComment } from './CommentSection'
import { PayPlan } from './PayPlan'
import { PlanViewer } from './PlanViewer'
import { PLAN_STATUSES } from './statusCopy'

type Detail = { id: string; status: string; createdAt?: string; messages: Message[]; comments?: PlanComment[]; priceCents?: number | null }
type State = { phase: 'loading' } | { phase: 'error'; text: string } | { phase: 'ready'; chat: Detail }

type Props = {
  chatId: string
  children?: ReactNode
  refreshKey?: number
  showTranscript?: boolean
  onLoaded?: (messages: Message[]) => void
}

export function CaseDetails({ chatId, children, refreshKey = 0, showTranscript = true, onLoaded }: Props) {
  const router = useRouter()
  const [state, setState] = useState<State>({ phase: 'loading' })
  const onLoadedRef = useRef(onLoaded)
  useEffect(() => {
    onLoadedRef.current = onLoaded
  })
  const [returned] = useState(() => typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('paid') === '1')

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/chats/${chatId}`, { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) return router.replace('/login')
        if (res.status === 404) return setState({ phase: 'error', text: 'We could not find this case.' })
        if (!res.ok) throw new Error()
        const chat: Detail = await res.json()
        if (!Array.isArray(chat.messages) || typeof chat.status !== 'string') throw new Error()
        setState({ phase: 'ready', chat })
        onLoadedRef.current?.(chat.messages)
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ phase: 'error', text: 'We could not load this case. Please refresh the page.' })
      })
    return () => controller.abort()
  }, [chatId, refreshKey, router])

  const addComment = (status: string, comment: PlanComment) =>
    setState((prev) =>
      prev.phase === 'ready' ? { phase: 'ready', chat: { ...prev.chat, status, comments: [...(prev.chat.comments ?? []), comment] } } : prev,
    )

  const setStatus = (status: string) =>
    setState((prev) => (prev.phase === 'ready' ? { phase: 'ready', chat: { ...prev.chat, status } } : prev))

  return (
    <>
      {state.phase === 'ready' && (
        <>
          <CaseHeader id={state.chat.id} createdAt={state.chat.createdAt} messages={state.chat.messages} />
          <CaseHero chatId={state.chat.id} status={state.chat.status} />
          <CaseJourney status={state.chat.status} />
        </>
      )}
      {children}
      {state.phase === 'loading' && <p role="status" className="mt-6 text-sm">Loading your case…</p>}
      {state.phase === 'error' && (
        <p role="alert" className="mt-6 text-sm text-destructive">
          {state.text}
        </p>
      )}
      {state.phase === 'ready' && (
        <>
          {PLAN_STATUSES.includes(state.chat.status) && (
            <>
              <PlanViewer chatId={state.chat.id} />
              <CommentSection chatId={state.chat.id} status={state.chat.status} comments={state.chat.comments ?? []} onPosted={addComment} />
              <ApprovePlan chatId={state.chat.id} status={state.chat.status} onApproved={setStatus} />
              <PayPlan chatId={state.chat.id} status={state.chat.status} priceCents={state.chat.priceCents ?? null} returned={returned} onStatus={setStatus} />
            </>
          )}
          {showTranscript && (
            <section aria-label="Conversation" className="mt-8 flex flex-col gap-4">
              {state.chat.messages.map((m) => (
                <ChatMessage key={m.id} message={m} />
              ))}
            </section>
          )}
        </>
      )}
    </>
  )
}
