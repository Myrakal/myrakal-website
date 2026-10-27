import { Footer } from '@/components/Footer'
import { GoldThreadMain, ThreadStop } from '@/components/GoldThread'
import { JsonLd } from '@/components/JsonLd'
import { Navbar } from '@/components/Navbar'
import { CARE_SERVICE, ORGANIZATION } from '@/lib/structured-data'

const SERVICES = [
  { title: 'Find your doctor', body: 'We find the right doctor for your treatment, matched to your needs, your schedule and your budget.' },
  { title: 'Insurance and financing', body: 'We work with your insurance to cover what it can, and help you arrange financing for the rest.' },
  { title: 'Everything arranged', body: 'We compare prices, fill out the paperwork, and book your appointments, and your hotel and transport when you travel.' },
  { title: 'Aftercare', body: 'We follow up after treatment and coordinate the care that comes next.' },
  { title: 'Prescriptions, handled', body: 'We find the best price on your medications and have them delivered.' },
  { title: 'With you at every step', body: 'One team guides you from your first question to your last follow-up.' },
]

const TIERS = [
  { tier: 'Everyday', outcomes: [
    ['Know your numbers', 'Lab tests and bloodwork'],
    ['Your everyday medicine', 'Prescriptions, sourced and delivered'],
    ['A doctor’s opinion', 'Consults and second opinions'],
    ['See clearly', 'Imaging, including MRI, CT and ultrasound'],
  ] },
  { tier: 'Ongoing', outcomes: [
    ['Your smile', 'Cleanings through full restorations'],
    ['Starting a family', 'IVF, clinics and medication'],
    ['Staying on track', 'Recurring care and follow-ups'],
  ] },
  { tier: 'Major', outcomes: [
    ['Your face and body', 'Rhinoplasty, eyelids and facelifts'],
    ['Your hair', 'Transplants and aftercare'],
    ['Back on your feet', 'Joint and orthopedic surgery'],
  ] },
]

const STANDARDS = [
  { title: 'Clinics', body: 'We vet every clinic before we work with it, and decline those that fall short.' },
  { title: 'Doctors', body: 'A licensed doctor reviews and approves every plan before anything is arranged.' },
  { title: 'Protection', body: 'What is covered if something goes wrong is set out in your plan before you commit.' },
]

const PATHS = [
  { label: 'For yourself', href: '/individual', note: 'Start with a doctor’s review' },
  { label: 'For your team', href: '/business', note: 'Care as a benefit for your people' },
]

const label = 'font-grotesk text-[11px] font-light tracking-[0.28em] text-champagne uppercase'
const band = 'mx-auto max-w-6xl px-6 sm:px-12'

export default function Care() {
  return (
    <>
      <JsonLd data={[ORGANIZATION, CARE_SERVICE]} />
      <Navbar />
      <GoldThreadMain className="bg-velvet-deep text-cream">
        <header className={`${band} relative pt-40 pb-28 sm:pt-52`}>
          <div className="relative">
            <ThreadStop />
            <p className={label}>Care</p>
          </div>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] font-normal text-balance sm:text-7xl">
            Every kind of care, <i className="text-champagne">arranged.</i>
          </h1>
          <p className="mt-8 max-w-xl text-lg font-light text-muted-foreground">
            Tell us what you need. We find the right doctor and the right price, then handle every detail along the way.
          </p>
        </header>

        <section aria-labelledby="what-we-do" className="border-t border-champagne/20 bg-velvet">
          <div className={`${band} py-28`}>
            <h2 id="what-we-do" className="font-display text-4xl font-normal sm:text-5xl">What we do</h2>
            <ol className="mt-16 max-w-3xl space-y-20">
              {SERVICES.slice(0, 4).map(({ title, body }, i) => (
                <li key={title} className="relative">
                  <ThreadStop marked />
                  <p aria-hidden="true" className="font-grotesk text-xs tracking-[0.3em] text-champagne">{String(i + 1).padStart(2, '0')}</p>
                  <h3 className="mt-3 font-display text-3xl font-normal sm:text-4xl">{title}</h3>
                  <p className="mt-3 max-w-xl font-light text-muted-foreground">{body}</p>
                </li>
              ))}
            </ol>
            <div className="mt-24 grid gap-12 border-t border-champagne/20 pt-12 sm:grid-cols-2">
              {SERVICES.slice(4).map(({ title, body }) => (
                <div key={title}>
                  <h3 className="font-display text-2xl font-normal sm:text-3xl">{title}</h3>
                  <p className="mt-3 font-light text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section aria-labelledby="what-we-cover" className={`${band} py-28`}>
          <div className="relative">
            <ThreadStop />
          </div>
          <h2 id="what-we-cover" className="font-display text-4xl font-normal sm:text-5xl">What we cover</h2>
          <div className="mt-16 grid gap-14 md:grid-cols-3">
            {TIERS.map(({ tier, outcomes }) => (
              <div key={tier}>
                <h3 className={label}>{tier}</h3>
                <ul className="mt-6 space-y-6">
                  {outcomes.map(([name, detail]) => (
                    <li key={name}>
                      <p className="font-display text-2xl">{name}</p>
                      <p className="mt-1 text-sm font-light text-muted-foreground">{detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="mt-20 font-display text-2xl text-champagne italic sm:text-3xl">
            Don’t see it? If it can be planned, we can arrange it.
          </p>
        </section>

        <section aria-labelledby="standards" className="border-t border-champagne/20 bg-velvet">
          <div className={`${band} py-28`}>
            <div className="relative">
              <ThreadStop />
            </div>
            <h2 id="standards" className="font-display text-4xl font-normal sm:text-5xl">Our standards</h2>
            <div className="mt-14 grid gap-12 md:grid-cols-3">
              {STANDARDS.map(({ title, body }) => (
                <div key={title}>
                  <h3 className={label}>{title}</h3>
                  <p className="mt-4 font-light text-muted-foreground">{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className={band}>
          <div className="relative">
            <ThreadStop />
          </div>
        </div>
        <nav aria-label="Get started" className={`${band} grid gap-6 py-28 md:grid-cols-2`}>
          {PATHS.map(({ label: name, href, note }) => (
            <a
              key={name}
              href={href}
              className="group border border-champagne/85 p-10 transition-colors hover:bg-champagne/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
            >
              <span className="block font-display text-4xl">{name} <span aria-hidden="true">→</span></span>
              <span className="mt-3 block font-light text-muted-foreground">{note}</span>
            </a>
          ))}
        </nav>
      </GoldThreadMain>
      <Footer />
    </>
  )
}
