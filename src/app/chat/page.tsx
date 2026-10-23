import type { Metadata } from 'next'
import { Suspense } from 'react'

import Chat from '@/views/Chat'

export const metadata: Metadata = { title: 'Chat: Myrakal', robots: { index: false } }

export default function ChatPage() {
  return (
    <Suspense>
      <Chat />
    </Suspense>
  )
}
