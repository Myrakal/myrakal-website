'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import wordmark from '@/assets/myrakal-wordmark.svg'
import { AttachmentUpload } from '@/components/chat/AttachmentUpload'
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
type AttachmentRequest = { label: string }
type Reply = { reply: Message; status: string; progress: Progress; attachmentRequest: AttachmentRequest | null }
type Detail = { status: string; progress: Progress; messages: Message[] }

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

class RateLimited extends Error {}

const post = (url: string, body?: object) =>
  fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: body && JSON.stringify(body) })

export default function Chat() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [initialId] = useState(() => {
    const id = searchParams.get('id')
    return id && UUID.test(id) ? id : null
  })
  const [chatId, setChatId] = useState(initialId)
  const [messages, setMessages] = useState<Message[]>([])
  const [progress, setProgress] = useState<Progress | null>(null)
  const [attachmentRequest, setAttachmentRequest] = useState<AttachmentRequest | null>(null)
  const [busy, setBusy] = useState(false)
  const [loading, setLoading] = useState(initialId !== null)
  const [error, setError] = useState('')
  const [loadFailed, setLoadFailed] = useState(false)
  const end = useRef<HTMLDivElement>(null)
  const dock = useRef<HTMLDivElement>(null)
  const opened = useRef(false)

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
        setLoadFailed(true)
        setLoading(false)
      })
    return () => controller.abort()
  }, [initialId, router])

  useEffect(() => {
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    end.current?.scrollIntoView?.({ block: 'end', behavior: opened.current && !reduced ? 'smooth' : 'auto' })
    if (messages.length > 0) opened.current = true
  }, [messages, busy, loading])

  useEffect(() => {
    const composer = dock.current
    const target = end.current
    if (!composer || !target) return
    const measure = () => {
      target.style.scrollMarginBottom = `${composer.offsetHeight}px`
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(composer)
    return () => observer.disconnect()
  }, [])

  const send = async (text: string) => {
    const pending: Message = { id: `pending-${Date.now()}`, role: 'user', text }
    const drop = () => setMessages((all) => all.filter((m) => m.id !== pending.id))
    setError('')
    setBusy(true)
    setMessages((all) => [...all, pending])
    try {
      let id = chatId
      if (!id) {
        const created = await post('/api/chats')
        if (created.status === 429) throw new RateLimited()
        if (!created.ok) throw new Error()
        id = (await created.json()).id as string
        setChatId(id)
        window.history.replaceState(null, '', `/chat?id=${id}`)
      }
      const res = await post(`/api/chats/${id}/messages`, { text })
      if (res.status === 401 || res.status === 409) {
        drop()
        if (res.status === 401) router.replace('/login')
        else router.push(`/chats/${id}`)
        return true
      }
      if (res.status === 429) throw new RateLimited()
      if (!res.ok) throw new Error()
      const data: Reply = await res.json()
      setMessages((all) => [...all, data.reply])
      setProgress(data.progress)
      setAttachmentRequest(data.attachmentRequest ?? null)
      if (data.status !== 'intake') router.push(`/chats/${id}`)
      return true
    } catch (e) {
      drop()
      setError(e instanceof RateLimited ? 'You have reached the limit for this chat. Please contact us to continue.' : 'Your message was not sent. Please try again.')
      return false
    } finally {
      setBusy(false)
    }
  }

  const upload = async (file: File) => {
    const form = new FormData()
    form.set('file', file)
    setError('')
    try {
      const res = await fetch(`/api/chats/${chatId}/attachments`, { method: 'POST', body: form })
      if (res.status === 401 || res.status === 409) {
        router.push(res.status === 401 ? '/login' : `/chats/${chatId}`)
        return false
      }
      if (!res.ok) throw new Error()
      const { message } = (await res.json()) as { message: Message }
      setMessages((all) => [...all, message])
      return true
    } catch {
      setError(`${file.name} could not be uploaded. Check the file type and size (10 MB max) and try again.`)
      return false
    }
  }

  const skip = () => {
    setAttachmentRequest(null)
    send("I don't have this right now.")
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
          {loading && <p role="status" className="text-center text-sm">Loading your conversation…</p>}
          {busy && <TypingIndicator />}
          <div ref={end} />
        </div>

        <div ref={dock} className="sticky bottom-0 bg-background pt-2 pb-4 sm:pb-6">
          {error && (
            <p role="alert" className="px-2 pb-2 text-center text-sm text-destructive">
              {error}
            </p>
          )}
          {attachmentRequest && chatId && <AttachmentUpload label={attachmentRequest.label} onUpload={upload} onSkip={skip} busy={busy} />}
          {progress && <IntakeProgress {...progress} />}
          <ChatComposer onSend={send} busy={busy || loading || loadFailed} />
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
