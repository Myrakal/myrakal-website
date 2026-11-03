'use client'

import { useId, useState, type FormEvent } from 'react'

export type PlanComment = { id: string; text: string; createdAt: string }

type Props = {
  chatId: string
  status: string
  comments: PlanComment[]
  onPosted: (status: string, comment: PlanComment) => void
}

const MAX_LENGTH = 4000

export function CommentSection({ chatId, status, comments, onPosted }: Props) {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const id = useId()
  const canComment = status === 'plan_ready'
  const trimmed = text.trim()

  if (!canComment && comments.length === 0) return null

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!trimmed || sending) return
    setSending(true)
    setError(null)
    let res: Response
    try {
      res = await fetch(`/api/chats/${chatId}/comments`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text: trimmed }),
      })
    } catch {
      setError('We could not send your comments. Please try again.')
      setSending(false)
      return
    }
    setSending(false)
    if (res.status === 409) return setError('Your plan can no longer be commented on. Please refresh the page.')
    if (res.status === 401) return setError('Your session has ended. Please sign in again.')
    if (!res.ok) return setError('We could not send your comments. Please try again.')
    const body = await res.json().catch(() => null)
    setText('')
    onPosted(typeof body?.status === 'string' ? body.status : 'clarification_review', {
      id: `local-${Date.now()}`,
      text: trimmed,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <section aria-label="Comments" className="mt-8">
      <h2 className="font-display text-3xl text-cream italic">Your comments</h2>
      {comments.length > 0 && (
        <ul aria-label="Previous comments" className="mt-4 flex flex-col gap-3">
          {comments.map((c) => (
            <li key={c.id} className="border border-rule bg-velvet-deep/40 px-5 py-4 text-cream">
              <time dateTime={c.createdAt} className="block font-caslon text-xs tracking-[0.2em] text-mist uppercase">
                {new Date(c.createdAt).toLocaleString()}
              </time>
              <p className="mt-1 break-words whitespace-pre-wrap">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
      {canComment && (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
          <label htmlFor={id} className="font-caslon text-xs tracking-[0.26em] text-champagne uppercase">
            Your comments on the plan
          </label>
          <textarea
            id={id}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={MAX_LENGTH}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            rows={4}
            className="w-full border border-rule bg-ink p-3 text-cream focus-visible:border-champagne focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne aria-invalid:border-destructive"
          />
          {error && (
            <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <button type="submit" disabled={!trimmed || sending} className="self-start border border-champagne/85 px-6 py-3.5 sm:px-10 font-caslon text-xs tracking-[0.28em] text-champagne uppercase transition-colors hover:bg-champagne hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne disabled:pointer-events-none disabled:opacity-50">
            {sending ? 'Sending…' : 'Send comments'}
          </button>
        </form>
      )}
    </section>
  )
}
