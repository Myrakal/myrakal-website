'use client'

import { useId, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'

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
      <h2 className="text-xl">Your comments</h2>
      {comments.length > 0 && (
        <ul aria-label="Previous comments" className="mt-4 flex flex-col gap-3">
          {comments.map((c) => (
            <li key={c.id} className="rounded-2xl border border-border bg-card px-5 py-3 text-card-foreground">
              <time dateTime={c.createdAt} className="block text-xs text-card-foreground/70">
                {new Date(c.createdAt).toLocaleString()}
              </time>
              <p className="mt-1 break-words whitespace-pre-wrap">{c.text}</p>
            </li>
          ))}
        </ul>
      )}
      {canComment && (
        <form onSubmit={submit} className="mt-4 flex flex-col gap-3">
          <label htmlFor={id} className="text-sm font-medium">
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
            className="w-full rounded-2xl border border-border bg-card p-3 text-card-foreground focus-visible:ring-2 focus-visible:ring-foreground/40 focus-visible:outline-none"
          />
          {error && (
            <p id={`${id}-error`} role="alert" className="text-sm text-destructive">
              {error}
            </p>
          )}
          <Button type="submit" disabled={!trimmed || sending} className="self-start">
            {sending ? 'Sending…' : 'Send comments'}
          </Button>
        </form>
      )}
    </section>
  )
}
