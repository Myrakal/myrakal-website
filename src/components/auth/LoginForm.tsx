'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useId, useRef, useState, type FormEvent } from 'react'

import { authInputClass, authLabelClass, authPanelClass } from '@/components/auth/AuthField'
import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/useSession'
import { getSupabase } from '@/lib/supabase'

export function LoginForm() {
  const router = useRouter()
  const { user } = useSession()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState('')
  const leaving = useRef(false)
  const emailId = useId()
  const passwordId = useId()
  const signup = mode === 'signup'

  useEffect(() => {
    if (user && !leaving.current) {
      leaving.current = true
      router.push('/dashboard')
    }
  }, [user, router])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const supabase = getSupabase()
    if (!supabase) return setError('Sign in is unavailable right now. Please try again later.')
    setBusy(true)
    setError('')
    setNotice('')
    const credentials = { email: email.trim(), password }
    try {
      const result = signup ? await supabase.auth.signUp(credentials) : await supabase.auth.signInWithPassword(credentials)
      if (result.error) return setError(result.error.message)
      if (!result.data.session) return setNotice('Check your email to confirm your account, then log in.')
      leaving.current = true
      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={submit} className={authPanelClass}>
      <h2 className="font-display text-2xl">{signup ? 'Create your account' : 'Welcome back'}</h2>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={emailId} className={authLabelClass}>
          Email
        </label>
        <input id={emailId} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={authInputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={passwordId} className={authLabelClass}>
          Password
        </label>
        <input
          id={passwordId}
          type="password"
          required
          minLength={8}
          autoComplete={signup ? 'new-password' : 'current-password'}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={authInputClass}
        />
      </div>
      {notice && <p role="status" className="text-sm">{notice}</p>}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {!signup && (
        <a href="/forgot-password" className="text-sm text-champagne underline underline-offset-4">
          Forgot password?
        </a>
      )}
      <Button type="submit" size="lg" disabled={busy} className="h-11">
        {busy ? 'Please wait…' : signup ? 'Sign up' : 'Log in'}
      </Button>
      <Button type="button" variant="link" disabled={busy} onClick={() => { setMode(signup ? 'login' : 'signup'); setError(''); setNotice('') }}>
        {signup ? 'I already have an account' : 'Create an account'}
      </Button>
    </form>
  )
}
