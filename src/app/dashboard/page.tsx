import type { Metadata } from 'next'

import { PortalShell } from '@/components/portal/PortalShell'

export const metadata: Metadata = { title: 'Your chats: Myrakal', robots: { index: false } }

export default function DashboardPage() {
  return <PortalShell title="Your chats" />
}
