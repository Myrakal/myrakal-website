'use client'

import { useCallback, useState } from 'react'

import wordmark from '@/assets/myrakal-wordmark.svg'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { CaseDetails } from '@/components/portal/CaseDetails'
import { ChatSidebar } from '@/components/portal/ChatSidebar'

export function Workspace({ chatId }: { chatId: string | null }) {
  const [createdId, setCreatedId] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(0)

  const onCreated = useCallback(
    (id: string) => {
      setCreatedId(id)
      window.history.replaceState(null, '', `/dashboard/${id}`)
    },
    [],
  )
  const [lockedId, setLockedId] = useState<string | null>(null)
  const onStatusChange = useCallback((_status: string, id: string, replace: boolean) => {
    setLockedId(id)
    if (!replace) setRefresh((value) => value + 1)
  }, [])
  const onLocked = useCallback((id: string) => {
    setLockedId(id)
    setRefresh((value) => value + 1)
  }, [])

  const live = chatId === null || chatId === createdId
  const caseId = chatId ?? createdId

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground lg:h-dvh lg:overflow-hidden">
      <header className="flex shrink-0 items-center border-b border-champagne/20 px-4 py-3 sm:px-6">
        <a
          href="/"
          aria-label="Myrakal home"
          className="focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
        >
          <img src={wordmark.src} alt="" className="h-7 w-auto" />
        </a>
      </header>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <div className="flex max-lg:[&>nav]:h-auto max-lg:[&>nav]:w-full! lg:min-h-0">
          <ChatSidebar activeId={caseId} />
        </div>
        <main className="min-w-0 px-4 pb-8 sm:px-6 lg:flex-1 lg:overflow-y-auto">
          {caseId ? (
            <CaseDetails key={`${caseId}:${refresh}`} chatId={caseId} overview />
          ) : (
            <p className="mt-10 text-center font-display text-2xl text-champagne italic">Start a conversation to open your case</p>
          )}
        </main>
        <section
          aria-label="Chat"
          className="flex min-h-[32rem] flex-col border-t border-champagne/20 px-4 lg:min-h-0 lg:w-[26rem] lg:shrink-0 lg:overflow-y-auto lg:border-t-0 lg:border-l"
        >
          {caseId !== null && lockedId === caseId ? (
            <p role="status" className="mt-10 text-center text-sm text-muted-foreground">
              This conversation is closed. A doctor is working on your case, and updates appear on the left.
            </p>
          ) : (
            <ChatPanel
              key={live ? 'live' : chatId}
              chatId={live ? null : chatId}
              onCreated={onCreated}
              onStatusChange={onStatusChange}
              onLocked={onLocked}
            />
          )}
        </section>
      </div>
    </div>
  )
}
