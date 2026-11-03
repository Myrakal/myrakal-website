import type { Metadata } from 'next'

import { Workspace } from '@/components/portal/Workspace'

export const metadata: Metadata = { title: 'Your workspace: Myrakal', robots: { index: false } }

export default function DashboardPage() {
  return <Workspace chatId={null} />
}
