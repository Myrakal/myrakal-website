'use client'

import { PanelLeftClose, PanelLeftOpen, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

import { STATUS_LABELS } from '@/components/portal/statusCopy'
import { buttonVariants } from '@/components/ui/button'
import { cn } from 'cn'

type Chat = { id: string; status: string; createdAt: string; summary: string | null }

export function ChatSidebar({ activeId = null }: { activeId?: string | null }) {
  const router = useRouter()
  const [chats, setChats] = useState<Chat[] | null>(null)
  const [state, setState] = useState<'loading' | 'ready' | 'error' | 'signed-out'>('loading')
  const [collapsed, setCollapsed] = useState(false)

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
        setChats([...body].sort((a: Chat, b: Chat) => b.createdAt.localeCompare(a.createdAt)))
        setState('ready')
      })
      .catch(() => {
        if (!controller.signal.aborted) setState('error')
      })
    return () => controller.abort()
  }, [router])

  return (
    <nav aria-label="Your chats" className={cn('flex shrink-0 flex-col gap-4 border-r border-rule bg-velvet-deep/40 p-3 h-full min-h-0', 'w-72', collapsed && 'lg:w-16 lg:items-center')}>
      <div className={cn('flex items-center gap-2', 'justify-between', collapsed && 'lg:flex-col lg:justify-start')}>
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand chat list' : 'Collapse chat list'}
          className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'text-champagne max-lg:hidden' })}
        >
          {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
        </button>
        <a
          href="/dashboard"
          aria-label="New chat"
          className={cn('inline-flex items-center justify-center gap-2 border border-champagne/85 bg-ink/35 font-caslon text-xs tracking-[0.26em] text-champagne uppercase transition-colors hover:bg-champagne hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne', collapsed ? 'h-11 px-4 lg:size-8 lg:px-0' : 'h-11 px-4')}
        >
          <Plus aria-hidden="true" />
          <span className={cn(collapsed && 'lg:hidden')}>New chat</span>
        </a>
      </div>
      <div className={cn('contents', collapsed && 'lg:hidden')}>
      {state === 'loading' && <p role="status" className="text-sm text-mist">Loading your chats…</p>}
      {state === 'signed-out' && <p role="status" className="text-sm text-mist">Redirecting to log in…</p>}
      {state === 'error' && (
        <p role="alert" className="text-sm text-destructive">We could not load your chats. Please refresh the page.</p>
      )}
      {state === 'ready' && chats?.length === 0 && <p className="text-sm text-mist">No chats yet. Start one to tell us about your care.</p>}
      {state === 'ready' && !!chats?.length && (
        <ul className="flex min-h-0 flex-col gap-2 overflow-y-auto">
          {chats.map((chat) => (
            <li key={chat.id}>
              <a
                href={`/dashboard/${chat.id}`}
                aria-current={chat.id === activeId ? 'page' : undefined}
                className={cn(
                  'flex flex-col gap-1 border bg-velvet-deep/60 px-4 py-3 text-cream no-underline transition-colors hover:bg-velvet/60',
                  chat.id === activeId ? 'border-champagne' : 'border-rule',
                )}
              >
                <span className="truncate font-display text-base italic">{chat.summary || (chat.status === 'intake' ? 'New conversation' : 'Your case')}</span>
                <span className="flex items-center justify-between gap-2">
                  <time dateTime={chat.createdAt} className="font-caslon text-xs tracking-[0.12em] text-mist">
                    {new Date(chat.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </time>
                  <span className="border border-champagne/50 px-2 py-0.5 font-caslon text-[10px] tracking-[0.18em] text-champagne uppercase">{STATUS_LABELS[chat.status] ?? chat.status}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
      </div>
    </nav>
  )
}
