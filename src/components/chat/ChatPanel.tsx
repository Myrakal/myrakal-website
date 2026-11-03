'use client'

import { useEffect, useRef } from 'react'

import { AttachmentUpload } from '@/components/chat/AttachmentUpload'
import { ChatComposer } from '@/components/chat/ChatComposer'
import { ChatMessage, type Message } from '@/components/chat/ChatMessage'
import { IntakeProgress } from '@/components/chat/IntakeProgress'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { useChat } from '@/hooks/useChat'

const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  text: 'Hi—I’m glad you reached out. I’ll ask a few short questions so a licensed doctor can understand what’s going on. What would you like help with? If you already have a diagnosis, you can share it. If not, just tell me what has been bothering you.',
}

type Props = {
  chatId: string | null
  onCreated?: (id: string) => void
  onStatusChange?: (status: string, id: string, replace: boolean) => void
  onLocked?: (id: string) => void
}

export function ChatPanel({ chatId, onCreated, onStatusChange, onLocked }: Props) {
  const { messages, progress, busy, loading, error, loadFailed, attachmentRequest, send, upload, skip } = useChat(chatId, { onCreated, onStatusChange, onLocked })
  const end = useRef<HTMLDivElement>(null)
  const dock = useRef<HTMLDivElement>(null)
  const opened = useRef(false)

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    end.current?.scrollIntoView?.({ block: 'end', behavior: opened.current && !reduced ? 'smooth' : 'auto' })
    if (messages.length > 0) opened.current = true
  }, [messages, busy, loading])

  useEffect(() => {
    const composer = dock.current
    const target = end.current
    if (!composer || !target) return
    let shown = composer.offsetHeight > 0
    const measure = () => {
      const height = composer.offsetHeight
      target.style.scrollMarginBottom = `${height}px`
      if (height > 0 && !shown) target.scrollIntoView?.({ block: 'end', behavior: 'auto' })
      shown = height > 0
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(composer)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div role="log" aria-label="Conversation" className="flex flex-1 flex-col gap-4 py-6">
        <ChatMessage message={GREETING} />
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} />
        ))}
        {loading && <p role="status" className="text-center font-caslon text-xs tracking-[0.26em] text-mist uppercase">Loading your conversation…</p>}
        {busy && <TypingIndicator />}
        <div ref={end} />
      </div>

      <div ref={dock} className="sticky bottom-0 bg-background pt-2 pb-4 sm:pb-6">
        {attachmentRequest && <AttachmentUpload label={attachmentRequest.label} onUpload={upload} onSkip={skip} busy={busy} />}
        {error && (
          <p role="alert" className="px-2 pb-2 text-center text-sm text-destructive">
            {error}
          </p>
        )}
        {progress && <IntakeProgress {...progress} />}
        <ChatComposer onSend={send} busy={busy || loading || loadFailed} />
        <p className="mt-3 px-2 text-center text-xs leading-5 text-mist">
          See our{' '}
          <a className="underline underline-offset-4 hover:text-champagne" href="/privacy/">
            Privacy Policy
          </a>{' '}
          for how we handle what you share.
        </p>
      </div>
    </>
  )
}
