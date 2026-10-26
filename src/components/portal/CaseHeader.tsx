import type { Message } from '@/components/chat/ChatMessage'
import { caseTitle } from './caseTitle'

export function CaseHeader({ id, createdAt, messages }: { id: string; createdAt?: string; messages: Message[] }) {
  const started = createdAt ? new Date(createdAt) : null
  return (
    <header className="mt-6 flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
      <div className="min-w-0">
        <p className="font-grotesk text-[11px] tracking-[0.2em] text-champagne uppercase">Your care · Case {id.slice(0, 4).toUpperCase()}</p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">{caseTitle(messages)}</h1>
      </div>
      {started && !Number.isNaN(started.getTime()) && (
        <p className="text-sm text-muted-foreground">
          Started {started.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      )}
    </header>
  )
}
