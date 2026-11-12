'use client'

import { useActionState, useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'

import { login, type LoginState } from './actions'

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {})
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (state.error) input.current?.focus()
  }, [state])
  return (
    <form action={action} className="flex w-full max-w-sm flex-col gap-4">
      <label htmlFor="password" className="text-foreground">
        Password
      </label>
      <input
        id="password"
        ref={input}
        name="password"
        type="password"
        required
        autoFocus
        autoComplete="current-password"
        aria-invalid={state.error ? true : undefined}
        aria-describedby={state.error ? 'password-error' : undefined}
        className="h-10 rounded-lg border border-border bg-background px-3 text-foreground"
      />
      {state.error && (
        <p id="password-error" role="alert" className="text-sm text-destructive">
          {state.error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={pending}>
        {pending ? 'Checking…' : 'Enter'}
      </Button>
    </form>
  )
}
