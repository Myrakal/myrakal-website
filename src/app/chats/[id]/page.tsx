import type { Metadata } from 'next'

import ChatPortal from './ChatPortal'

export const metadata: Metadata = { title: 'Your case: Myrakal', robots: { index: false } }

export default function ChatPortalPage() {
  return <ChatPortal />
}
