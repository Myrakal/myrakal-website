'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { AuthField, authPanelClass } from '@/components/auth/AuthField'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/useSession'
import { getSupabase } from '@/lib/supabase'

function useAuthRequest(request: (auth: NonNullable<ReturnType<typeof getSupabase>>['auth']) => Promise<{ error: { message: string } | null }>, onDone: () => void) {
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const supabase = getSupabase()
    if (!supabase) return setError('This is unavailable right now. Please try again later.')
    setBusy(true)
    setError('')
    try {
      const { error: failure } = await request(supabase.auth)
      if (!failure) return onDone()
      setError(failure.message)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setBusy(false)
  }

  return { error, busy, submit }
}

function ErrorText({ error }: { error: string }) {
  return error ? (
    <p role="alert" className="text-sm text-destructive">
      {error}
    </p>
  ) : null
}

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const { error, busy, submit } = useAuthRequest(
    (auth) => {
      setSent(false)
      return auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` })
    },
    () => setSent(true),
  )

  return (
    <form onSubmit={submit} className={authPanelClass}>
      <AuthField label="Email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <ErrorText error={error} />
      <p role="status" className="text-sm">
        {sent && 'Check your email for a link to reset your password.'}
      </p>
      <Button type="submit" size="lg" disabled={busy} className="h-11">
        Send reset link
      </Button>
      <a href="/login" className="text-center text-sm text-champagne underline underline-offset-4">
        Back to log in
      </a>
    </form>
  )
}

export function ResetPasswordForm() {
  const router = useRouter()
  const { user, loading } = useSession()
  const [password, setPassword] = useState('')
  const { error, busy, submit } = useAuthRequest(
    (auth) => auth.updateUser({ password }),
    () => {
      router.push('/dashboard')
      router.refresh()
    },
  )

  if (loading) return null
  if (!user)
    return (
      <p className="mt-8 text-sm">
        This reset link is invalid or has expired.{' '}
        <a href="/forgot-password" className="text-champagne underline underline-offset-4">
          Request a new reset link
        </a>
      </p>
    )

  return (
    <form onSubmit={submit} className={authPanelClass}>
      <AuthField label="New password" type="password" minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <ErrorText error={error} />
      <Button type="submit" size="lg" disabled={busy} className="h-11">
        Save new password
      </Button>
    </form>
  )
}
