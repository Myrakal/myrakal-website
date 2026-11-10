import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { Navbar } from '@/components/Navbar'
import { TextUsButton } from '@/components/TextUsButton'
import { GUIDES } from '@/lib/guides'
import { SITE } from '@/lib/site'
import { ORGANIZATION } from '@/lib/structured-data'
import type { Treatment } from '@/lib/treatments'

const EYEBROW = 'font-caslon text-xs tracking-[0.32em] text-champagne uppercase'
const LINK = 'text-cream underline underline-offset-4 hover:text-champagne focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne'
const H2 = 'max-w-3xl font-display text-4xl leading-tight text-cream sm:text-6xl'

export function TreatmentPage({ treatment }: { treatment: Treatment }) {
  const faqs: [string, string][] = [
    ['Do I have to go abroad?', 'No. We look near you and across the U.S. first. Abroad is one option, and we only suggest it when the savings are worth the trip.'],
    ...treatment.faqs,
    ['What does it cost?', 'Comparing options is free. If you want us to book and coordinate everything, we charge one coordination fee, shown before you commit. We never take money from clinics.'],
    ["What if I don't have a quote yet?", "Tell us what you need and we'll help you get one."],
  ]
  return (
    <>
      <JsonLd data={[ORGANIZATION, { '@context': 'https://schema.org', '@type': 'Service', name: `${treatment.name} care, compared and booked`, description: treatment.description, url: `${SITE}/${treatment.slug}`, provider: { '@id': `${SITE}/#organization` } }]} />
      <Navbar />
      <main>
        <section className="bg-charcoal px-6 pt-36 pb-24 sm:px-12">
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 text-center">
            <p className={EYEBROW}>{treatment.name}</p>
            <h1 className="font-display text-4xl text-champagne italic sm:text-6xl">{treatment.headline}</h1>
            <p className="max-w-2xl font-caslon text-lg leading-relaxed text-cream/95">{treatment.intro}</p>
            <TextUsButton className="mt-4" />
          </div>
        </section>
        <section aria-labelledby="where-we-look" className="bg-ink px-6 py-24 sm:px-12 lg:py-32">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 text-center">
            <div className="flex flex-col items-center gap-6">
              <p className={EYEBROW}>Where we look</p>
              <h2 id="where-we-look" className={H2}>
                Near you first, <i className="text-champagne">then anywhere.</i>
              </h2>
            </div>
            <ul className="grid w-full gap-px bg-rule md:grid-cols-3">
              {treatment.places.map(([title, body]) => (
                <li key={title} className="flex flex-col items-center gap-4 bg-ink px-6 py-10 md:px-10">
                  <h3 className="font-display text-3xl text-cream">{title}</h3>
                  <p className="max-w-xs font-caslon text-lg leading-relaxed text-mist">{body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
        <section aria-labelledby="questions" className="border-t border-rule bg-ink px-6 py-24 sm:px-12">
          <div className="mx-auto flex max-w-2xl flex-col gap-8">
            <h2 id="questions" className={`${H2} text-center`}>
              Questions
            </h2>
            {faqs.map(([question, answer]) => (
              <details key={question} className="border-b border-rule pb-6">
                <summary className="cursor-pointer list-none font-display text-2xl text-cream outline-offset-4 focus-visible:outline-2 focus-visible:outline-champagne marker:hidden after:ml-3 after:text-champagne after:content-['+'] [&::-webkit-details-marker]:hidden">
                  {question}
                </summary>
                <p className="mt-4 font-caslon text-lg leading-relaxed text-mist">{answer}</p>
              </details>
            ))}
            <TextUsButton className="mt-6 self-center" />
          </div>
        </section>
        <nav aria-labelledby="before-you-decide" className="border-t border-rule bg-ink px-6 py-20 sm:px-12">
          <div className="mx-auto flex max-w-2xl flex-col gap-5">
            <h2 id="before-you-decide" className={EYEBROW}>Before you decide</h2>
            <ul className="space-y-3 font-caslon text-lg">
              {treatment.guides.flatMap((slug) => GUIDES[slug] ?? []).map(({ slug, headline }) => (
                <li key={slug}><a href={`/guides/${slug}`} className={LINK}>{headline}</a></li>
              ))}
              <li><a href="/guides" className={LINK}>All guides <span aria-hidden="true">→</span></a></li>
            </ul>
          </div>
        </nav>
      </main>
      <Footer />
    </>
  )
}
