import { TriangleAlert } from 'lucide-react'

import { EMERGENCY_CONTINUE } from '@/lib/intake'

export type Message = { id: string; role: 'assistant' | 'user'; text: string; record?: string; emergency?: boolean }

export function ChatMessage({ message }: { message: Message }) {
  const mine = message.role === 'user'
  if (message.emergency)
    return (
      <article aria-label="Myrakal" className="flex justify-start">
        <div className="max-w-[85%] rounded-3xl rounded-bl-md border-2 border-destructive bg-card px-5 py-3 text-card-foreground sm:max-w-[75%]">
          <p role="alert" className="flex gap-3 text-base leading-7 break-words whitespace-pre-wrap">
            <TriangleAlert className="mt-1.5 size-5 shrink-0" aria-hidden="true" />
            <span>{message.text}</span>
          </p>
          <p className="mt-2 pl-8 text-sm text-card-foreground/70">{EMERGENCY_CONTINUE}</p>
        </div>
      </article>
    )
  return (
    <article
      aria-label={mine ? 'You' : 'Myrakal'}
      className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
    >
      <p
        className={`max-w-[85%] rounded-3xl px-5 py-3 text-base leading-7 break-words whitespace-pre-wrap sm:max-w-[75%] ${
          mine
            ? 'rounded-br-md bg-(image:--pearl-gradient) text-primary-foreground'
            : 'rounded-bl-md bg-card text-card-foreground'
        }`}
      >
        {message.text}
      </p>
    </article>
  )
}
