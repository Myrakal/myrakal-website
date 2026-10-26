'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'

import wordmark from '@/assets/myrakal-wordmark.svg'
import { ChatPanel } from '@/components/chat/ChatPanel'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export default function Chat() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [initialId] = useState(() => {
    const id = searchParams.get('id')
    return id && UUID.test(id) ? id : null
  })

  const onCreated = useCallback((id: string) => {
    window.history.replaceState(null, '', `/chat?id=${id}`)
  }, [])

  const onStatusChange = useCallback(
    (_status: string, id: string, replace: boolean) => {
      if (replace) router.replace(`/chats/${id}`)
      else router.push(`/chats/${id}`)
    },
    [router],
  )

  const onLocked = useCallback((id: string) => router.push(`/chats/${id}`), [router])

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      <header className="sticky top-0 z-10 flex items-center bg-background px-4 py-4 sm:px-8">
        <a
          href="/"
          aria-label="Myrakal home"
          className="focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
        >
          <img src={wordmark.src} alt="" className="h-7 w-auto sm:h-9" />
        </a>
      </header>

      <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 sm:px-6">
        <ChatPanel chatId={initialId} onCreated={onCreated} onStatusChange={onStatusChange} onLocked={onLocked} />
      </main>
    </div>
  )
}
