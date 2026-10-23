import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Page not found: Myrakal' }

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-xl flex-col items-start justify-center gap-4 px-6">
      <h1 className="font-heading text-4xl text-foreground">Page not found</h1>
      <p className="text-foreground">We could not find the page you were looking for.</p>
      <a className="underline underline-offset-4" href="/">
        Back to home
      </a>
    </main>
  )
}
