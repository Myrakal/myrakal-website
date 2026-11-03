'use client'

import { useCallback, useState } from 'react'

import wordmark from '@/assets/myrakal-wordmark.svg'
import { ChatMessage, type Message } from '@/components/chat/ChatMessage'
import { ChatPanel } from '@/components/chat/ChatPanel'
import { CaseDetails } from '@/components/portal/CaseDetails'
import { ChatSidebar } from '@/components/portal/ChatSidebar'
import { WorkspaceTabs } from '@/components/portal/WorkspaceTabs'

export function Workspace({ chatId }: { chatId: string | null }) {
  const [createdId, setCreatedId] = useState<string | null>(null)
  const [refresh, setRefresh] = useState(0)
  const [preferred, setPreferred] = useState<'chat' | undefined>()
  const [messages, setMessages] = useState<{ id: string; list: Message[] } | null>(null)

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
    <div className="flex h-dvh flex-col overflow-hidden bg-ink text-cream">
      <header className="flex shrink-0 items-center border-b border-rule px-4 py-3 sm:px-6">
        <a
          href="/"
          aria-label="Myrakal home"
          className="focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
        >
          <img src={wordmark.src} alt="" className="h-7 w-auto" />
        </a>
      </header>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <WorkspaceTabs
          initial={chatId === null ? 'chat' : 'case'}
          preferred={preferred}
          chats={
            <div className="flex max-lg:min-h-0 max-lg:flex-1 max-lg:[&>nav]:w-full! max-lg:[&>nav]:border-r-0 lg:min-h-0">
              <ChatSidebar activeId={caseId} />
            </div>
          }
          details={
            <main aria-labelledby="workspace-title" className="min-w-0 px-4 pb-8 sm:px-6 lg:flex-1 lg:overflow-y-auto">
              <h1 id="workspace-title" className="sr-only">
                Your case
              </h1>
              {caseId ? (
                <CaseDetails key={caseId} chatId={caseId} refreshKey={refresh} showTranscript={false} overview onLoaded={(list, status) => {
                    setMessages({ id: caseId, list })
                    if (status === 'intake') setPreferred('chat')
                  }} />
              ) : (
                <p className="mt-10 text-center font-display text-2xl text-champagne italic">Start a conversation to open your case</p>
              )}
            </main>
          }
          chat={
            <section
              aria-label="Chat"
              className="flex flex-col px-4 max-lg:flex-1 lg:min-h-0 lg:w-[26rem] lg:shrink-0 lg:overflow-y-auto lg:border-l lg:border-rule"
            >
              {caseId !== null && lockedId === caseId ? (
                <>
                  <p role="status" className="my-6 text-center text-sm text-mist">
                    This conversation is closed. A doctor is working on your case, and updates appear in the case details.
                  </p>
                  <div role="log" aria-label="Conversation" className="flex flex-col gap-4 pb-8">
                    {(messages?.id === caseId ? messages.list : []).map((m) => (
                      <ChatMessage key={m.id} message={m} />
                    ))}
                  </div>
                </>
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
          }
        />
      </div>
    </div>
  )
}
