import type { Metadata } from 'next'

import { ResetPasswordForm } from '@/components/auth/PasswordResetForms'
import { PortalShell } from '@/components/portal/PortalShell'

export const metadata: Metadata = { title: 'Reset password: Myrakal', robots: { index: false } }

export default function ResetPasswordPage() {
  return (
    <PortalShell title="Choose a new password">
      <ResetPasswordForm />
    </PortalShell>
  )
}
