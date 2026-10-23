'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useId, useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { useSession } from '@/hooks/useSession'
import { getSupabase } from '@/lib/supabase'

const inputClass =
  'h-11 w-full rounded-xl border border-border bg-card px-4 text-base outline-none focus-visible:ring-2 focus-visible:ring-foreground/40'

export function LoginForm() {
  const router = useRouter()
  const { user } = useSession()
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const emailId = useId()
  const passwordId = useId()
  const signup = mode === 'signup'

  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user, router])

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const supabase = getSupabase()
    if (!supabase) return setError('Sign in is unavailable right now. Please try again later.')
    setBusy(true)
    setError('')
    const credentials = { email: email.trim(), password }
    let result = signup ? await supabase.auth.signUp(credentials) : await supabase.auth.signInWithPassword(credentials)
    if (signup && !result.error && !result.data.session) result = await supabase.auth.signInWithPassword(credentials)
    if (result.error) {
      setError(result.error.message)
      setBusy(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={submit} className="mt-8 flex max-w-sm flex-col gap-4">
      <h2 className="text-xl">{signup ? 'Create your account' : 'Welcome back'}</h2>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={emailId} className="text-sm font-medium">
          Email
        </label>
        <input id={emailId} type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor={passwordId} className="text-sm font-medium">
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
          className={inputClass}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={busy} className="h-11">
        {busy ? 'Please wait…' : signup ? 'Sign up' : 'Log in'}
      </Button>
      <Button type="button" variant="link" onClick={() => { setMode(signup ? 'login' : 'signup'); setError('') }}>
        {signup ? 'I already have an account' : 'Create an account'}
      </Button>
    </form>
  )
}
