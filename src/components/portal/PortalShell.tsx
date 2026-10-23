import type { ReactNode } from 'react'

export function PortalShell({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="px-6 py-4">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between">
          <a href="/" className="font-heading text-2xl text-foreground no-underline">
            Myrakal
          </a>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl px-6 py-10">
        <h1 className="text-3xl">{title}</h1>
        {children}
      </main>
    </div>
  )
}
