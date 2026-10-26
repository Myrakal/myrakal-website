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
    <nav aria-label="Your chats" className={cn('flex shrink-0 flex-col gap-4 border-r border-champagne/20 bg-card/40 p-3 h-full min-h-0', collapsed ? 'w-16 items-center' : 'w-72')}>
      <div className={cn('flex items-center gap-2', collapsed ? 'flex-col' : 'justify-between')}>
        <button
          type="button"
          onClick={() => setCollapsed((value) => !value)}
          aria-expanded={!collapsed}
          aria-label={collapsed ? 'Expand chat list' : 'Collapse chat list'}
          className={buttonVariants({ variant: 'ghost', size: 'icon', className: 'text-champagne' })}
        >
          {collapsed ? <PanelLeftOpen aria-hidden="true" /> : <PanelLeftClose aria-hidden="true" />}
        </button>
        <a
          href="/dashboard"
          aria-label="New chat"
          className={buttonVariants({ size: collapsed ? 'icon' : 'lg', className: collapsed ? '' : 'px-4' })}
        >
          <Plus aria-hidden="true" />
          {!collapsed && 'New chat'}
        </a>
      </div>
      {!collapsed && state === 'loading' && <p role="status" className="text-sm">Loading your chats…</p>}
      {!collapsed && state === 'signed-out' && <p role="status" className="text-sm">Redirecting to log in…</p>}
      {!collapsed && state === 'error' && (
        <p role="alert" className="text-sm text-destructive">We could not load your chats. Please refresh the page.</p>
      )}
      {!collapsed && state === 'ready' && chats?.length === 0 && <p className="text-sm">No chats yet. Start one to tell us about your care.</p>}
      {!collapsed && state === 'ready' && !!chats?.length && (
        <ul className="flex min-h-0 flex-col gap-2 overflow-y-auto">
          {chats.map((chat) => (
            <li key={chat.id}>
              <a
                href={`/dashboard/${chat.id}`}
                aria-current={chat.id === activeId ? 'page' : undefined}
                className={cn(
                  'flex flex-col gap-1 rounded-2xl border bg-card px-4 py-3 text-card-foreground no-underline transition-colors hover:bg-primary/90',
                  chat.id === activeId ? 'border-champagne' : 'border-border',
                )}
              >
                <span className="truncate font-medium">{chat.summary || (chat.status === 'intake' ? 'New conversation' : 'Your case')}</span>
                <span className="flex items-center justify-between gap-2">
                  <time dateTime={chat.createdAt} className="text-xs text-card-foreground/70">
                    {new Date(chat.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                  </time>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{STATUS_LABELS[chat.status] ?? chat.status}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
