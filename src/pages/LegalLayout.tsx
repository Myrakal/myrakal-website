import { useEffect, type ReactNode } from 'react'
import { Footer } from '@/components/Footer'

const LAST_UPDATED = 'September 24, 2026'

type LegalLayoutProps = {
  title: string
  documentTitle: string
  description: string
  eyebrow: string
  lede: string
  children: ReactNode
}

export function LegalLayout({
  title,
  documentTitle,
  description,
  eyebrow,
  lede,
  children,
}: LegalLayoutProps) {
  useEffect(() => {
    const previousTitle = document.title
    const existing = document.querySelector('meta[name="description"]')
    const meta = existing ?? document.createElement('meta')
    const previousDescription = meta.getAttribute('content')

    document.title = documentTitle
    meta.setAttribute('name', 'description')
    meta.setAttribute('content', description)
    if (!existing) document.head.appendChild(meta)
    window.scrollTo(0, 0)

    return () => {
      document.title = previousTitle
      if (!existing) meta.remove()
      else if (previousDescription !== null) meta.setAttribute('content', previousDescription)
    }
  }, [documentTitle, description])

  return (
    <>
      <header className="bg-primary px-6 py-4">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6">
          <a
            href="/"
            className="text-2xl font-semibold text-primary-foreground no-underline"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Myrakal
          </a>
          <a href="/" className="text-sm text-primary-foreground underline-offset-4 hover:underline">
            Return home
          </a>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-6xl gap-14 px-6 py-14 md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:gap-[clamp(3rem,8vw,7rem)] md:py-[clamp(4rem,8vw,7rem)]">
        <div className="self-start md:sticky md:top-8">
          <p className="mb-5 text-xs font-bold tracking-[0.15em] text-primary uppercase">{eyebrow}</p>
          <h1 className="text-balance text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.98] font-medium tracking-[-0.055em]">
            {title}
          </h1>
          <p className="mt-7 text-[1.05rem] leading-7 text-muted-foreground">{lede}</p>
          <p className="mt-6 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
        </div>

        <div className="max-w-2xl leading-[1.7]">{children}</div>
      </main>

      <Footer />
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
          ? 'my-2 rounded-2xl border border-border bg-secondary p-5'
          : 'border-t border-border py-8 first:border-t-0 first:pt-0'
      }
    >
      <h2 className="mb-3 text-balance text-xl font-semibold tracking-[-0.02em] text-primary">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  )
}

export function List({ children }: { children: ReactNode }) {
  return <ul className="list-disc space-y-2 pl-5">{children}</ul>
}

export function MailLink({ subject, children }: { subject: string; children?: ReactNode }) {
  return (
    <a
      href={`mailto:hello@myrakal.com?subject=${encodeURIComponent(subject)}`}
      className="underline underline-offset-4 hover:decoration-2"
    >
      {children ?? 'hello@myrakal.com'}
    </a>
  )
}
