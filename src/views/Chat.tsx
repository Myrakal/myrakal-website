'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import wordmark from '@/assets/myrakal-wordmark.svg'
import { ChatComposer } from '@/components/chat/ChatComposer'
import { ChatMessage, type Message } from '@/components/chat/ChatMessage'
import { IntakeProgress } from '@/components/chat/IntakeProgress'
import { TypingIndicator } from '@/components/chat/TypingIndicator'

const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  text: "Hi, and welcome to Myrakal. Thank you for reaching out. I'm here to gather a few details so one of our licensed doctors can review your case. To start, do you already have a diagnosis, or are you still figuring things out? Either is perfectly fine.",
}

type Progress = { collected: number; total: number }
type Reply = { reply: Message; status: string; progress: Progress }
type Detail = { status: string; progress: Progress; messages: Message[] }

const post = (url: string, body?: object) =>
  fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: body && JSON.stringify(body) })

export default function Chat() {
  const router = useRouter()
  const [initialId] = useState(useSearchParams().get('id'))
  const [chatId, setChatId] = useState(initialId)
  const [messages, setMessages] = useState<Message[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(initialId !== null)
  const [error, setError] = useState('')
  const end = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!initialId) return
    const controller = new AbortController()
    fetch(`/api/chats/${initialId}`, { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) return router.replace('/login')
        if (!res.ok) throw new Error()
        const detail: Detail = await res.json()
        if (detail.status !== 'intake') return router.replace(`/chats/${initialId}`)
        setMessages(detail.messages)
        setProgress(detail.progress)
        setLoading(false)
      })
      .catch(() => {
        if (controller.signal.aborted) return
        setError('We could not load this chat. Please refresh the page.')
        setLoading(false)
      })
    return () => controller.abort()
  }, [initialId, router])

  useEffect(() => {
    end.current?.scrollIntoView?.({ block: 'end' })
  }, [messages, busy])

  const send = async (text: string) => {
    const pending: Message = { id: `pending-${Date.now()}`, role: 'user', text }
    setError('')
    setBusy(true)
    setMessages((all) => [...all, pending])
    try {
      let id = chatId
      if (!id) {
        const created = await post('/api/chats')
        if (!created.ok) throw new Error()
        id = (await created.json()).id as string
        setChatId(id)
        window.history.replaceState(null, '', `/chat?id=${id}`)
      }
      const res = await post(`/api/chats/${id}/messages`, { text })
      if (res.status === 401) return router.replace('/login')
      if (res.status === 409) return router.push(`/chats/${id}`)
      if (!res.ok) throw new Error()
      const data: Reply = await res.json()
      setMessages((all) => [...all, data.reply])
      setProgress(data.progress)
      if (data.status !== 'intake') router.push(`/chats/${id}`)
    } catch {
      setMessages((all) => all.filter((m) => m.id !== pending.id))
      setError('Your message was not sent. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center bg-background px-4 py-4 sm:px-8">
        <a
          href="/"
          aria-label="Myrakal home"
          className="focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          <img src={wordmark.src} alt="" className="h-7 w-auto sm:h-9" />
        </a>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 sm:px-6">
        <div role="log" aria-label="Conversation" className="flex flex-1 flex-col gap-4 py-6">
          <ChatMessage message={GREETING} />
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {busy && <TypingIndicator />}
          <div ref={end} />
        </div>

        <div className="sticky bottom-0 bg-background pt-2 pb-4 sm:pb-6">
          {error && (
            <p role="alert" className="px-2 pb-2 text-center text-sm text-destructive">
              {error}
            </p>
          )}
          {progress && <IntakeProgress {...progress} />}
          <ChatComposer onSend={send} busy={busy || loading} />
          <p className="mt-3 px-2 text-center text-xs leading-5 text-muted-foreground">
            See our{' '}
            <a className="underline underline-offset-4 hover:text-foreground" href="/privacy/">
              Privacy Policy
            </a>{' '}
            for how we handle what you share.
          </p>
        </div>
      </main>
    </div>
  )
}
