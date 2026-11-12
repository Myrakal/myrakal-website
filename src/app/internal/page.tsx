import type { Metadata } from 'next'

import InternalTool from '@/components/internal/InternalTool'
import { isAuthed } from '@/lib/internal-auth'
import { loadGraph } from '@/lib/internal/graph'

import { logout } from './actions'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = { title: 'Internal', robots: { index: false } }

async function load() {
  try {
    return { raw: await loadGraph() }
  } catch (e) {
    console.error('internal graph load failed', e)
    return { error: 'The care network data is unavailable. Please try again.' }
  }
}

export default async function InternalPage() {
  if (!(await isAuthed())) {
    return (
      <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-6 px-6">
        <h1 className="font-heading text-4xl text-foreground">Internal</h1>
        <LoginForm />
      </main>
    )
  }
  const data = await load()
  return (
    <>
      <InternalTool {...data} />
      <form action={logout} className="fixed right-6 top-5 z-20">
        <button type="submit" className="text-xs uppercase tracking-[0.2em] text-[#e8a63c] underline underline-offset-4">
          Sign out
        </button>
      </form>
    </>
  )
}
