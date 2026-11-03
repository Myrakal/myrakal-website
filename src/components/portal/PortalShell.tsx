import type { ReactNode } from 'react'

import logo from '@/assets/myrakal-logo.svg'

export function PortalShell({ title, centered = false, children }: { title: string; centered?: boolean; children?: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-ink text-cream">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[44rem] max-w-full -translate-x-1/2 rounded-full bg-velvet/50 blur-3xl"
      />
      <header className="relative border-b border-rule">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-6 py-4">
          <a
            href="/"
            aria-label="Myrakal home"
            className="focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
          >
            <img src={logo.src} alt="" className="h-9 w-auto sm:h-11" />
          </a>
          <p className="font-caslon text-xs tracking-[0.26em] text-champagne uppercase">Member area</p>
        </div>
      </header>
      <main
        className={`relative mx-auto w-full max-w-3xl flex-1 px-6 py-12 sm:py-16 ${centered ? 'flex flex-col items-center justify-center' : ''}`}
      >
        <h1 className={`font-display text-4xl text-champagne italic sm:text-5xl ${centered ? 'text-center' : ''}`}>{title}</h1>
        <div className="mt-3 h-px w-16 bg-champagne/85" />
        {children}
      </main>
      <footer className="relative px-6 pb-8 text-center">
        <p className="font-display text-sm text-mist italic">Healthcare, as it should be</p>
      </footer>
    </div>
  )
}
