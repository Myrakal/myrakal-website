import { useEffect, useRef, useState } from 'react'

import wordmark from '@/assets/myrakal-wordmark.svg'
import { ChatComposer } from '@/components/chat/ChatComposer'
import { ChatMessage, type Message } from '@/components/chat/ChatMessage'

const GREETING: Message = {
  id: 'greeting',
  role: 'assistant',
  text: "Hi, I'm Myrakal's intake assistant. I'll gather a few details so a licensed doctor can review your case. Do you already have a diagnosis, or are you still figuring things out?",
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([GREETING])
  const end = useRef<HTMLDivElement>(null)
  const nextId = useRef(0)

  useEffect(() => {
    if (messages.length > 1) end.current?.scrollIntoView?.({ block: 'end' })
  }, [messages])

  const send = (text: string) =>
    setMessages((m) => [...m, { id: `user-${nextId.current++}`, role: 'user', text }])

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
          <div ref={end} />
        </div>

        <div className="sticky bottom-0 bg-background pt-2 pb-4 sm:pb-6">
          <ChatComposer onSend={send} />
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
