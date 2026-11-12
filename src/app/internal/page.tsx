import type { Metadata } from 'next'

import { isAuthed } from '@/lib/internal-auth'

import { logout } from './actions'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = { title: 'Internal: Myrakal', robots: { index: false } }

export default async function InternalPage() {
  const authed = await isAuthed()
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-6 px-6">
      <h1 className="font-heading text-4xl text-foreground">Internal</h1>
      {authed ? (
        <>
          <p className="text-foreground">The care network tool will appear here.</p>
          <form action={logout}>
            <button type="submit" className="underline underline-offset-4">
              Sign out
            </button>
          </form>
        </>
      ) : (
        <LoginForm />
      )}
    </main>
  )
}
