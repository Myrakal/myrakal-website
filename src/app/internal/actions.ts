'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { SESSION_COOKIE, SESSION_MAX_AGE, sessionToken, verifyPassword } from '@/lib/internal-auth'

export type LoginState = { error?: string }

const options = () => ({
  httpOnly: true,
  sameSite: 'strict' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/internal',
})

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const password = formData.get('password')
  const token = sessionToken()
  if (typeof password !== 'string' || !token || !verifyPassword(password)) return { error: 'Incorrect password' }
  ;(await cookies()).set(SESSION_COOKIE, token, { ...options(), maxAge: SESSION_MAX_AGE })
  redirect('/internal')
}

export async function logout() {
  ;(await cookies()).set(SESSION_COOKIE, '', { ...options(), maxAge: 0 })
  redirect('/internal')
}
