import type { Metadata } from 'next'

import { Workspace } from '@/components/portal/Workspace'

export const metadata: Metadata = { title: 'Your case: Myrakal', robots: { index: false } }

export default async function DashboardCasePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <Workspace chatId={id} />
}
