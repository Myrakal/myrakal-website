'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { buttonVariants } from '@/components/ui/button'

type Chat = { id: string; status: string; createdAt: string; summary: string | null }

const LABELS: Record<string, string> = {
  intake: 'In conversation',
  doctor_review: 'With a doctor',
  plan_ready: 'Plan ready',
  clarification_review: 'Reviewing your comments',
  awaiting_payment: 'Awaiting payment',
  reservations: 'Making reservations',
  booked: 'Booked',
}

const href = (chat: Chat) => (chat.status === 'intake' ? `/chat?id=${chat.id}` : `/chats/${chat.id}`)

export function ChatList() {
  const router = useRouter()
  const [chats, setChats] = useState<Chat[] | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error' | 'signed-out'>('loading')

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/chats', { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) {
          setState('signed-out')
          router.replace('/login')
          return
        }
        if (!res.ok) throw new Error()
        const body = await res.json()
        if (!Array.isArray(body)) throw new Error()
        setChats(body)
        setState('ready')
      })
      .catch(() => {
        if (!controller.signal.aborted) setState('error')
      })
    return () => controller.abort()
  }, [router])

  return (
    <div className="mt-8">
      <a href="/chat" className={buttonVariants({ size: 'lg', className: 'h-11 px-5' })}>
        New chat
      </a>
      {state === 'loading' && <p role="status" className="mt-6 text-sm">Loading your chats…</p>}
      {state === 'signed-out' && <p role="status" className="mt-6 text-sm">Redirecting to log in…</p>}
      {state === 'error' && (
        <p role="alert" className="mt-6 text-sm text-destructive">
          We could not load your chats. Please refresh the page.
        </p>
      )}
      {state === 'ready' && chats?.length === 0 && <p className="mt-6 text-sm">No chats yet. Start one to tell us about your care.</p>}
      {state === 'ready' && !!chats?.length && (
        <ul className="mt-6 flex flex-col gap-3">
          {chats.map((chat) => (
            <li key={chat.id}>
              <a href={href(chat)} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-border bg-card px-5 py-4 text-card-foreground no-underline transition-colors hover:bg-primary/90">
                <span className="flex min-w-0 flex-col">
                  <span className="truncate font-medium">{chat.summary || (chat.status === 'intake' ? 'New conversation' : 'Your case')}</span>
                  <time dateTime={chat.createdAt} className="text-xs text-muted-foreground">
                    {new Date(chat.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </time>
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">{LABELS[chat.status] ?? chat.status}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
