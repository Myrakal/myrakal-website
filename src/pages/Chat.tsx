import { useEffect, useRef, useState } from 'react'

import wordmark from '@/assets/myrakal-wordmark.svg'
import { ChatComposer } from '@/components/chat/ChatComposer'
import { ChatMessage, type Message } from '@/components/chat/ChatMessage'
import { TypingIndicator } from '@/components/chat/TypingIndicator'
import { INTAKE_PROMPTS, replyFor } from '@/lib/intake'

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
  const turns = useRef(0)
  const [answered, setAnswered] = useState(0)
  const complete = answered > INTAKE_PROMPTS.length && !typing

  useEffect(() => () => clearTimeout(timer.current), [])

  useEffect(() => {
    if (messages.length > 1) end.current?.scrollIntoView?.({ block: 'end' })
  }, [messages, typing])

  const send = (text: string) => {
    const id = nextId.current++
    const turn = ++turns.current
    setAnswered(turn)
    setMessages((m) => [...m, { id: `user-${id}`, role: 'user', text }])
    setTyping(true)
    timer.current = setTimeout(() => {
      setMessages((m) => [...m, { id: `assistant-${id}`, role: 'assistant', text: replyFor(turn) }])
      setTyping(false)
    }, replyDelay)
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
          <ChatComposer
            onSend={send}
            busy={typing}
            placeholder={complete ? 'Add anything else for the doctor' : 'Type your message'}
          />
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
