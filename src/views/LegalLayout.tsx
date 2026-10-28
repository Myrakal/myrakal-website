import type { ReactNode } from 'react'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'

const LAST_UPDATED = 'September 24, 2026'

type LegalLayoutProps = {
  title: string
  eyebrow: string
  lede: string
  children: ReactNode
}

export function LegalLayout({
  title,
  eyebrow,
  lede,
  children,
}: LegalLayoutProps) {
  return (
    <>
      <Navbar />
      <main className="bg-ink font-caslon text-cream">
        <div className="mx-auto grid w-full max-w-6xl gap-14 px-6 pt-36 pb-24 sm:px-12 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-[clamp(3rem,8vw,7rem)] md:pt-48">
          <div className="self-start md:sticky md:top-32">
            <p className="mb-5 text-xs tracking-[0.32em] text-champagne uppercase">{eyebrow}</p>
            <h1 className="font-display text-[clamp(2.4rem,4.5vw,3.75rem)] hyphens-auto leading-[1.02] font-normal text-balance">{title}</h1>
            <p className="mt-7 text-[1.05rem] leading-7 text-mist">{lede}</p>
            <p className="mt-6 text-sm text-mist">Last updated: {LAST_UPDATED}</p>
          </div>

          <div className="max-w-2xl text-[17px] leading-[1.75] text-cream/90">{children}</div>
        </div>
      </main>

      <Footer talk={false} />
    </>
  )
}

export function Section({
  title,
  callout = false,
  children,
}: {
  title: string
  callout?: boolean
  children: ReactNode
}) {
  return (
    <section
      className={
        callout
          ? 'my-2 border border-champagne/60 p-6'
          : 'border-t border-rule py-8 first:border-t-0 first:pt-0'
      }
    >
      <h2 className="mb-3 font-display text-2xl font-normal text-balance text-cream">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export function List({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5 marker:text-champagne">{children}</ul>
}

export function MailLink({ subject, children }: { subject: string; children?: ReactNode }) {
  return (
    <a
      href={`mailto:eshaansood@myrakal.com?subject=${encodeURIComponent(subject)}`}
      className="text-champagne underline decoration-champagne/50 underline-offset-4 hover:decoration-champagne"
    >
      {children ?? 'eshaansood@myrakal.com'}
    </a>
  )
}
