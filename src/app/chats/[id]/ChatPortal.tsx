'use client'

import { useParams } from 'next/navigation'

import { CaseDetails } from '@/components/portal/CaseDetails'
import { PortalShell } from '@/components/portal/PortalShell'

export default function ChatPortal() {
  const { id } = useParams<{ id: string }>()
  return (
    <PortalShell title="Your case">
      <CaseDetails chatId={id}>
        <a href="/dashboard" className="mt-6 inline-block text-sm underline underline-offset-4">
          ← Your chats
        </a>
      </CaseDetails>
    </PortalShell>
  )
}
