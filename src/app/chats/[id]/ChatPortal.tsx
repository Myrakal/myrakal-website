'use client'

import { useParams } from 'next/navigation'

import { PortalShell } from '@/components/portal/PortalShell'

export default function ChatPortal() {
  const { id } = useParams<{ id: string }>()
  return (
    <PortalShell title="Your case">
      <p data-chat-id={id} className="sr-only">
        Chat {id}
      </p>
    </PortalShell>
  )
}
