import { useEffect, useRef, useState } from 'react'

import wordmark from '@/assets/myrakal-wordmark.svg'
import { ChatComposer } from '@/components/chat/ChatComposer'
import { ChatMessage, type Message } from '@/components/chat/ChatMessage'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import {
  EMAIL_RETRY,
  extractEmail,
  INTAKE_COMPLETE,
  INTAKE_FAILED,
  INTAKE_PROMPTS,
  replyFor,
  withoutThanks,
} from '@/lib/intake'
import { acknowledge } from '@/lib/acknowledge'
import { submitIntake } from '@/lib/submitIntake'

const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  text: "Hi, and welcome to Myrakal. Thank you for reaching out. I'm here to gather a few details so one of our licensed doctors can review your case. To start, do you already have a diagnosis, or are you still figuring things out? Either is perfectly fine.",
}

export default function Chat({ replyDelay = 800 }: { replyDelay?: number }) {
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const end = useRef<HTMLDivElement>(null)
  const [typing, setTyping] = useState(false)
  const nextId = useRef(0)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const accepted = useRef(0)
  const contact = useRef({ name: '', email: '' })
  const mounted = useRef(true)
  const wake = useRef<() => void>(undefined)
  const unsaved = useRef(false)
  const pending = useRef<AbortController>(undefined)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      clearTimeout(timer.current)
      pending.current?.abort()
      wake.current?.()
    }
  }, [])

  useEffect(() => {
    if (messages.length > 1) end.current?.scrollIntoView?.({ block: 'end' })
  }, [messages, typing])

  const save = async (transcript: Message[]) => {
    const controller = new AbortController()
    pending.current = controller
    try {
      await submitIntake({ ...contact.current, transcript }, controller.signal)
      if (!controller.signal.aborted) unsaved.current = false
      return INTAKE_COMPLETE
    } catch {
      if (!controller.signal.aborted) unsaved.current = true
      return INTAKE_FAILED
    }
  }

  const respond = async (text: string, transcript: Message[]) => {
    if (unsaved.current) {
      contact.current.email = extractEmail(text) ?? contact.current.email
      return save(transcript)
    }
    if (accepted.current === INTAKE_PROMPTS.length) {
      const email = extractEmail(text)
      if (!email) return EMAIL_RETRY
      contact.current.email = email
      accepted.current++
      return save(transcript)
    }
    const askAi = accepted.current < INTAKE_PROMPTS.length - 1
    if (accepted.current === INTAKE_PROMPTS.length - 1) contact.current.name = text.trim().slice(0, 200)
    accepted.current++
    const next = replyFor(accepted.current)
    if (!askAi) return next
    const controller = new AbortController()
    pending.current = controller
    const ack = await acknowledge(transcript, controller.signal)
    return ack ? `${ack} ${withoutThanks(next)}` : next
  }

  const send = async (text: string) => {
    const id = nextId.current++
    const userMessage: Message = { id: `user-${id}`, role: 'user', text }
    setMessages((m) => [...m, userMessage])
    setTyping(true)
    const wait = new Promise<void>((resolve) => {
      wake.current = resolve
      timer.current = setTimeout(resolve, replyDelay)
    })
    try {
      const [reply] = await Promise.all([respond(text, [...messages, userMessage]), wait])
      if (mounted.current) {
        setMessages((m) => [...m, { id: `assistant-${id}`, role: 'assistant', text: reply }])
        if (reply === INTAKE_COMPLETE) setSaved(true)
      }
    } finally {
      if (mounted.current) setTyping(false)
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
          <img src={wordmark} alt="" className="h-7 w-auto sm:h-9" />
        </a>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 sm:px-6">
        <div
          role="log"
          aria-label="Conversation"
          className="flex flex-1 flex-col gap-4 py-6"
        >
          {messages.map((m) => (
            <ChatMessage key={m.id} message={m} />
          ))}
          {typing && <TypingIndicator />}
          <div ref={end} className="scroll-mb-40" />
        </div>

        <div className="sticky bottom-0 bg-background pt-2 pb-4 sm:pb-6">
          <p role="status" className="min-h-6 px-2 pb-2 text-center text-sm text-foreground">
            {saved ? 'Intake complete. A licensed doctor will review your case.' : ''}
          </p>
          <ChatComposer onSend={send} busy={typing} locked={saved} />
          <p className="mt-3 px-2 text-center text-xs leading-5 text-muted-foreground">
            No account needed. See our{' '}
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
