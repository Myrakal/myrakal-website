import type { Metadata } from 'next'

import { Footer } from '@/components/Footer'
import { InsuranceCalculator } from '@/components/InsuranceCalculator'
import { JsonLd } from '@/components/JsonLd'
import { Navbar } from '@/components/Navbar'
import { TextUsButton } from '@/components/TextUsButton'
import { SITE } from '@/lib/site'
import { ORGANIZATION } from '@/lib/structured-data'

const PATH = '/tools/dental-insurance-calculator'

export const metadata: Metadata = {
  title: 'Dental insurance calculator: what your plan will really pay | Myrakal',
  description:
    'Enter your dental quote, annual maximum, coverage and deductible to see what insurance will pay for implants, All-on-4 or other major work, and what you pay yourself. Free.',
  alternates: { canonical: PATH },
}

const SOURCES = [
  ['Humana, "What does dental insurance cover?", updated February 13, 2026', 'https://www.humana.com/dental-insurance/dental-resources/what-does-dental-insurance-cover'],
  ['ADA News, "Dear ADA: Annual maximums", December 19, 2025', 'https://adanews.ada.org/ada-news/2025/december/dear-ada-annual-maximums/'],
] as const

export default function DentalInsuranceCalculator() {
  return (
    <>
      <JsonLd data={[ORGANIZATION, { '@context': 'https://schema.org', '@type': 'WebApplication', name: 'Dental insurance calculator', url: `${SITE}${PATH}`, applicationCategory: 'FinanceApplication', operatingSystem: 'Any', offers: { '@type': 'Offer', price: 0, priceCurrency: 'USD' }, provider: { '@id': `${SITE}/#organization` } }]} />
      <Navbar />
      <main>
        <section className="bg-charcoal px-6 pt-36 pb-24 sm:px-12">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-12 text-center">
            <div className="flex flex-col items-center gap-6">
              <p className="font-caslon text-xs tracking-[0.32em] text-champagne uppercase">Dental insurance calculator</p>
              <h1 className="font-display text-4xl text-champagne italic sm:text-6xl">How much will dental insurance actually pay?</h1>
            </div>
            <InsuranceCalculator />
          </div>
        </section>
        <section aria-labelledby="why-small" className="border-t border-rule bg-ink px-6 py-24 sm:px-12">
          <div className="mx-auto flex max-w-2xl flex-col gap-6 font-caslon text-lg leading-relaxed text-mist">
            <h2 id="why-small" className="font-display text-4xl leading-tight text-cream sm:text-5xl">
              Why the number is <i className="text-champagne">so small</i>
            </h2>
            <p>
              Dental plans cap what they pay each year. Humana puts the typical annual maximum at $1,000 to $2,000 per year, and the
              ADA notes that many plans still use a $1,000 level set about 40 years ago. Per the National Association of Dental Plans,
              cited by the ADA, 32.8% of in-network annual maximums fall between $1,000 and $1,500.
            </p>
            <p>
              Major work is often covered at up to 50%, and Humana says it can come with waiting periods of 3 months to a year. On a
              large quote, the cap is usually reached long before the 50% share is.
            </p>
            <h3 id="sources" className="font-caslon text-xs tracking-[0.32em] text-champagne uppercase">
              Sources
            </h3>
            <ul aria-labelledby="sources" className="flex flex-col gap-2 text-base">
              {SOURCES.map(([label, href]) => (
                <li key={href}>
                  <a href={href} className="underline underline-offset-4 hover:text-champagne">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-cream">
              If insurance leaves a big gap, send us your quote and we compare verified options near you, elsewhere in the U.S. and
              abroad.
            </p>
            <TextUsButton className="self-start" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
