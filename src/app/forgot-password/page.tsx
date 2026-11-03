import type { Metadata } from 'next'

import { ForgotPasswordForm } from '@/components/auth/PasswordResetForms'
import { PortalShell } from '@/components/portal/PortalShell'

export const metadata: Metadata = { title: 'Forgot password: Myrakal', robots: { index: false } }

export default function ForgotPasswordPage() {
  return (
    <PortalShell title="Forgot your password?">
      <ForgotPasswordForm />
    </PortalShell>
  )
}
