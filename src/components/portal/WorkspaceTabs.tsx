'use client'

import { useId, useRef, useState, useSyncExternalStore, type KeyboardEvent, type ReactNode } from 'react'

import { cn } from 'cn'

export type WorkspaceTab = 'chats' | 'case' | 'chat'

const TABS: { id: WorkspaceTab; label: string }[] = [
  { id: 'chats', label: 'Chats' },
  { id: 'case', label: 'Case' },
  { id: 'chat', label: 'Chat' },
]

const DESKTOP = '(min-width: 1024px)'

function subscribe(notify: () => void) {
  const query = window.matchMedia?.(DESKTOP)
  query?.addEventListener('change', notify)
  return () => query?.removeEventListener('change', notify)
}

function useDesktop() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia?.(DESKTOP).matches ?? false,
    () => false,
  )
}

type Props = { initial: WorkspaceTab; preferred?: WorkspaceTab; chats: ReactNode; details: ReactNode; chat: ReactNode }

export function WorkspaceTabs({ initial, preferred, chats, details, chat }: Props) {
  const base = useId()
  const [chosen, setActive] = useState<WorkspaceTab | null>(null)
  const active = chosen ?? preferred ?? initial
  const desktop = useDesktop()
  const refs = useRef<Record<string, HTMLButtonElement | null>>({})
  const content = { chats, case: details, chat }

  const onKeyDown = (event: KeyboardEvent) => {
    const index = TABS.findIndex((tab) => tab.id === active)
    const next =
      event.key === 'ArrowRight' ? (index + 1) % TABS.length
      : event.key === 'ArrowLeft' ? (index + TABS.length - 1) % TABS.length
      : event.key === 'Home' ? 0
      : event.key === 'End' ? TABS.length - 1
      : -1
    if (next < 0) return
    event.preventDefault()
    setActive(TABS[next].id)
    refs.current[TABS[next].id]?.focus()
  }

  return (
    <>
      {TABS.map((tab) => (
        <div
          key={tab.id}
          role={desktop ? undefined : 'tabpanel'}
          id={`${base}-panel-${tab.id}`}
          aria-labelledby={desktop ? undefined : `${base}-tab-${tab.id}`}
          className={cn(
            'lg:contents',
            tab.id === active ? 'max-lg:flex max-lg:min-h-0 max-lg:flex-1 max-lg:flex-col max-lg:overflow-y-auto' : 'max-lg:hidden',
          )}
        >
          {content[tab.id]}
        </div>
      ))}
      <div
        role="tablist"
        aria-label="Workspace sections"
        onKeyDown={onKeyDown}
        className="flex shrink-0 border-t border-champagne/20 bg-background pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[tab.id] = node
            }}
            type="button"
            role="tab"
            id={`${base}-tab-${tab.id}`}
            aria-selected={tab.id === active}
            aria-controls={`${base}-panel-${tab.id}`}
            tabIndex={tab.id === active ? 0 : -1}
            onClick={() => setActive(tab.id)}
            className={cn(
              'min-h-11 flex-1 px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-champagne',
              tab.id === active ? 'border-t-2 border-champagne text-champagne' : 'border-t-2 border-transparent text-muted-foreground',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </>
  )
}
