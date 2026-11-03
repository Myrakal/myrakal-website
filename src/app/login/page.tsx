import type { Metadata } from 'next'

import { LoginForm } from '@/components/auth/LoginForm'
import { PortalShell } from '@/components/portal/PortalShell'

export const metadata: Metadata = { title: 'Log in: Myrakal', robots: { index: false } }

export default function LoginPage() {
  return (
    <PortalShell title="Log in" centered>
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </PortalShell>
  )
}
