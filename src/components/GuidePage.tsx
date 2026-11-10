import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { Navbar } from '@/components/Navbar'
import { TextUsButton } from '@/components/TextUsButton'
import type { Guide } from '@/lib/guides/types'
import { SITE } from '@/lib/site'
import { ORGANIZATION } from '@/lib/structured-data'

const BODY = 'font-caslon text-lg leading-relaxed text-mist'

export function GuidePage({ guide }: { guide: Guide }) {
  const url = `${SITE}/guides/${guide.slug}`
  const updated = new Date(`${guide.updated}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
  const article = { '@context': 'https://schema.org', '@type': 'Article', headline: guide.headline, description: guide.description, url, dateModified: guide.updated, author: { '@id': `${SITE}/#organization` }, publisher: { '@id': `${SITE}/#organization` } }
  return (
    <>
      <JsonLd data={[ORGANIZATION, article]} />
      <Navbar />
      <main className="bg-ink px-6 pt-36 pb-24 sm:px-12">
        <article className="mx-auto flex max-w-2xl flex-col gap-10">
          <header className="flex flex-col gap-5">
            <p className="font-caslon text-xs tracking-[0.32em] text-champagne uppercase">Guide</p>
            <h1 className="font-display text-4xl leading-tight text-cream sm:text-5xl">{guide.headline}</h1>
            <p className="font-caslon text-xl leading-relaxed text-cream/95">{guide.answer}</p>
            <p className="font-caslon text-sm text-mist">
              Updated <time dateTime={guide.updated}>{updated}</time>
            </p>
          </header>
          {guide.sections.map(({ heading, steps, points, body }) => (
            <section key={heading} className="flex flex-col gap-4">
              <h2 className="font-display text-3xl text-cream">{heading}</h2>
              {steps && <ol className={`list-decimal space-y-3 pl-6 ${BODY}`}>{steps.map((step) => <li key={step}>{step}</li>)}</ol>}
              {points && <ul className={`list-disc space-y-3 pl-6 ${BODY}`}>{points.map((point) => <li key={point}>{point}</li>)}</ul>}
              {body && <p className={BODY}>{body}</p>}
            </section>
          ))}
          <TextUsButton className="self-start" />
          <section aria-labelledby="sources" className="flex flex-col gap-3 border-t border-rule pt-8">
            <h2 id="sources" className="font-caslon text-xs tracking-[0.32em] text-champagne uppercase">Sources</h2>
            <ul className="space-y-2 font-caslon text-sm">
              {guide.sources.map(([label, href]) => (
                <li key={href}><a href={href} className="text-mist underline underline-offset-4 hover:text-champagne focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne">{label}</a></li>
              ))}
            </ul>
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
