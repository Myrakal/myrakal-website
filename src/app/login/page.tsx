import type { Metadata } from 'next'

import { PortalShell } from '@/components/portal/PortalShell'

export const metadata: Metadata = { title: 'Log in: Myrakal' }

export default function LoginPage() {
  return <PortalShell title="Log in" />
}
