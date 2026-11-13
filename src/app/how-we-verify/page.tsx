import type { Metadata } from 'next'

import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { Navbar } from '@/components/Navbar'
import { TextUsButton } from '@/components/TextUsButton'
import { pageMetadata, SITE } from '@/lib/site'
import { ORGANIZATION } from '@/lib/structured-data'

const PATH = '/how-we-verify'
const LINK = 'text-cream underline underline-offset-4 hover:text-champagne focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne'
const BODY = 'font-caslon text-lg leading-relaxed text-mist'

export const metadata: Metadata = {
  title: 'How Myrakal verifies providers | Myrakal',
  description: 'See the official records Myrakal checks, what provider verification covers, and the limits patients should understand before booking care.',
  ...pageMetadata(PATH),
}

const CHECKS = [
  ['Identity and license', 'We match the provider to the official professional registry for the place where they practice and confirm that the listed license is active when we check it.'],
  ['Discipline and specialist claims', 'Where the registry publishes them, we review restrictions or disciplinary history. For surgeons and specialists, we also check claimed board or specialty credentials in the relevant directory.'],
  ['Facility claims', 'When a procedure uses a clinic, hospital, or surgery center, we check public registration or accreditation claims where a reliable public directory is available. If a claim cannot be independently confirmed, we do not present it as confirmed.'],
  ['The written quote', 'We compare the written price, what it includes, what it excludes, and the stated follow-up plan. For travel, we separate the care price from flights, lodging, and other costs.'],
] as const

const LIMITS = [
  'Verification is a point-in-time review of records available to us. A license, certification, or accreditation can change after we check it.',
  'Verification does not guarantee safety, quality, availability, or a particular medical or cosmetic result.',
  'A clean public record does not prove that a provider is the right choice for a specific patient or procedure.',
  'Myrakal is not a medical provider and does not diagnose, prescribe, or create treatment plans. A licensed clinician must decide what care is appropriate.',
] as const

export default function HowWeVerify() {
  const webPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'How Myrakal verifies providers',
    description: metadata.description,
    url: `${SITE}${PATH}`,
    dateModified: '2026-11-13',
    publisher: { '@id': `${SITE}/#organization` },
  }

  return (
    <>
      <JsonLd data={[ORGANIZATION, webPage]} />
      <Navbar />
      <main className="bg-ink px-6 pt-36 pb-24 sm:px-12">
        <article className="mx-auto flex max-w-3xl flex-col gap-14">
          <header className="flex flex-col gap-5">
            <p className="font-caslon text-xs tracking-[0.32em] text-champagne uppercase">Our verification standard</p>
            <h1 className="font-display text-4xl leading-tight text-cream sm:text-6xl">What “verified” means at Myrakal</h1>
            <p className="font-caslon text-xl leading-relaxed text-cream/95">
              “Verified” means a provider passed the checks below using the records available when we reviewed them. It is a screening standard, not an endorsement, a guarantee, or medical advice.
            </p>
            <p className="font-caslon text-sm text-mist">
              Methodology updated <time dateTime="2026-11-13">November 13, 2026</time>
            </p>
          </header>

          <section className="flex flex-col gap-6" aria-labelledby="checks">
            <h2 id="checks" className="font-display text-3xl text-cream sm:text-4xl">Checks we run before we suggest a provider</h2>
            <ol className="grid gap-px bg-rule sm:grid-cols-2">
              {CHECKS.map(([title, description], index) => (
                <li key={title} className="flex flex-col gap-4 bg-ink p-7">
                  <p className="font-caslon text-xs tracking-[0.25em] text-champagne uppercase">0{index + 1}</p>
                  <h3 className="font-display text-2xl text-cream">{title}</h3>
                  <p className={BODY}>{description}</p>
                </li>
              ))}
            </ol>
          </section>

          <section className="flex flex-col gap-5" aria-labelledby="records">
            <h2 id="records" className="font-display text-3xl text-cream sm:text-4xl">Records we use</h2>
            <p className={BODY}>
              In the U.S., we use state dental or medical boards, the Federation of State Medical Boards&apos; physician records, and recognized specialty-board directories when relevant. In Mexico, we use the federal professional registry and the recognized plastic-surgery council directory when relevant.
            </p>
            <p className={BODY}>
              Our <a href="/guides/verify-a-dentist-or-surgeon" className={LINK}>step-by-step verification guide</a> links to the official registries and explains what to look for in each one.
            </p>
          </section>

          <section className="flex flex-col gap-5" aria-labelledby="limits">
            <h2 id="limits" className="font-display text-3xl text-cream sm:text-4xl">What verification cannot tell you</h2>
            <ul className={`list-disc space-y-3 pl-6 ${BODY}`}>
              {LIMITS.map((limit) => <li key={limit}>{limit}</li>)}
            </ul>
          </section>

          <section className="flex flex-col gap-5 border-y border-rule py-10" aria-labelledby="independence">
            <h2 id="independence" className="font-display text-3xl text-cream sm:text-4xl">How we stay independent</h2>
            <p className={BODY}>
              Myrakal never takes money from clinics. Comparing options is free. If you choose Myrakal to book and coordinate care, you pay one coordination fee that is shown before you commit.
            </p>
          </section>

          <section className="flex flex-col gap-5" aria-labelledby="before-booking">
            <h2 id="before-booking" className="font-display text-3xl text-cream sm:text-4xl">Before you book</h2>
            <p className={BODY}>
              Ask for the date of the credential check, review the written treatment plan and price, and discuss your health history and options directly with a licensed clinician. If you are traveling, arrange follow-up care before you leave.
            </p>
            <TextUsButton className="mt-2 self-start" />
          </section>
        </article>
      </main>
      <Footer />
    </>
  )
}
