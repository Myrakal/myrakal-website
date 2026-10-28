'use client'

import { useRouter } from 'next/navigation'
import { useState, type FormEvent } from 'react'

import { AuthField, authButtonClass, authLinkClass, authPanelClass } from '@/components/auth/AuthField'
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
      <p role="status" className="text-sm text-cream">
        {sent && 'Check your email for a link to reset your password.'}
      </p>
      <button type="submit" disabled={busy} className={authButtonClass}>
        Send reset link
      </button>
      <a href="/login" className={`${authLinkClass} text-center`}>
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
      <p className="mt-8 text-sm text-mist">
        This reset link is invalid or has expired.{' '}
        <a href="/forgot-password" className="text-champagne underline underline-offset-4 hover:text-cream focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne">
          Request a new reset link
        </a>
      </p>
    )

  return (
    <form onSubmit={submit} className={authPanelClass}>
      <AuthField label="New password" type="password" minLength={8} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <ErrorText error={error} />
      <button type="submit" disabled={busy} className={authButtonClass}>
        Save new password
      </button>
    </form>
  )
}
