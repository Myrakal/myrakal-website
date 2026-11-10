import type { Metadata } from 'next'

import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { Navbar } from '@/components/Navbar'
import { TextUsButton } from '@/components/TextUsButton'
import { GUIDES } from '@/lib/guides'
import { ORGANIZATION } from '@/lib/structured-data'

export const metadata: Metadata = {
  title: 'Guides to expensive dental and cosmetic care | Myrakal',
  description: 'Plain answers on verifying a dentist or surgeon, whether dental work abroad is safe, when not to go, how facilitators compare, and what insurance will really pay.',
  alternates: { canonical: '/guides' },
}

const ENTRIES = [
  ...Object.values(GUIDES).map(({ slug, headline, description }) => [`/guides/${slug}`, headline, description]),
  ['/tools/dental-insurance-calculator', 'Dental insurance calculator', 'Enter your quote and plan details to see what insurance will pay and what you pay yourself.'],
] as const

export default function GuidesIndex() {
  return (
    <>
      <JsonLd data={[ORGANIZATION]} />
      <Navbar />
      <main className="bg-ink px-6 pt-36 pb-24 sm:px-12">
        <div className="mx-auto flex max-w-4xl flex-col gap-12">
          <header className="flex flex-col gap-5 text-center">
            <p className="font-caslon text-xs tracking-[0.32em] text-champagne uppercase">Guides</p>
            <h1 className="font-display text-4xl leading-tight text-cream sm:text-6xl">Know before you book.</h1>
          </header>
          <ul className="grid gap-px bg-rule md:grid-cols-2">
            {ENTRIES.map(([href, headline, description]) => (
              <li key={href} className="group relative flex flex-col gap-3 bg-ink p-8 transition-colors md:last:odd:col-span-2 hover:bg-velvet has-[:focus-visible]:bg-velvet">
                <h2 className="font-display text-2xl leading-snug text-cream">
                  <a href={href} className="transition-colors group-hover:text-champagne focus-visible:text-champagne after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-champagne">
                    {headline}
                  </a>
                </h2>
                <p className="font-caslon text-base leading-relaxed text-mist">{description}</p>
              </li>
            ))}
          </ul>
          <TextUsButton className="self-center" />
        </div>
      </main>
      <Footer />
    </>
  )
}
