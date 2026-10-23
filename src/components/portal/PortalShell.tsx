import type { ReactNode } from 'react'

import logo from '@/assets/myrakal-logo.svg'

export function PortalShell({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-background text-foreground">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[44rem] max-w-full -translate-x-1/2 rounded-full bg-accent/50 blur-3xl"
      />
      <header className="relative border-b border-champagne/20">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <a
            href="/"
            aria-label="Myrakal home"
            className="focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
          >
            <img src={logo.src} alt="" className="h-9 w-auto sm:h-11" />
          </a>
          <p className="font-grotesk text-[11px] tracking-[0.2em] text-champagne uppercase">Member area</p>
        </div>
      </header>
      <main className="relative mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:py-16">
        <h1 className="font-display text-4xl text-champagne italic sm:text-5xl">{title}</h1>
        <div className="mt-3 h-px w-16 bg-champagne/60" />
        {children}
      </main>
      <footer className="relative px-6 pb-8 text-center">
        <p className="font-display text-sm text-muted-foreground italic">Healthcare, as it should be</p>
      </footer>
    </div>
  )
}
