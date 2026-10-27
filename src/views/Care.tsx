import sheet from '@/assets/liquid-sheet.webp'
import sheetSmall from '@/assets/liquid-sheet-960.webp'
import { Footer } from '@/components/Footer'
import { JsonLd } from '@/components/JsonLd'
import { Navbar } from '@/components/Navbar'
import { CARE_SERVICE, ORGANIZATION } from '@/lib/structured-data'

const SERVICES = [
  { title: 'Doctors', body: 'We find the right doctor for your treatment, matched to your needs, your schedule and your budget.' },
  { title: 'Insurance and financing', body: 'We work with your insurance to cover what it can, and help you arrange financing for the rest.' },
  { title: 'Booking and travel', body: 'We compare prices, fill out the paperwork, and book your appointments, and your hotel and transport when you travel.' },
  { title: 'Aftercare', body: 'We follow up after treatment and coordinate the care that comes next.' },
  { title: 'Prescriptions', body: 'We find the best price on your medications and have them delivered.' },
  { title: 'Guidance', body: 'One team guides you from your first question to your last follow-up.' },
]

const TIERS = [
  { tier: 'Everyday', outcomes: [
    ['Your numbers', 'Lab tests and bloodwork'],
    ['Your prescriptions', 'Prescriptions, sourced and delivered'],
    ['Your second opinion', 'Consults and second opinions'],
    ['Your scans', 'Imaging, including MRI, CT and ultrasound'],
  ] },
  { tier: 'Ongoing', outcomes: [
    ['Your smile', 'Cleanings through full restorations'],
    ['Your family', 'IVF, clinics and medication'],
    ['Your follow-ups', 'Recurring care and follow-ups'],
  ] },
  { tier: 'Major', outcomes: [
    ['Your face and body', 'Rhinoplasty, eyelids and facelifts'],
    ['Your hair', 'Transplants and aftercare'],
    ['Your joints', 'Joint and orthopedic surgery'],
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

const label = 'font-caslon text-xs tracking-[0.32em] text-champagne uppercase'
const pad = 'px-6 sm:px-12 lg:px-24'
const split = `${pad} grid gap-12 py-24 sm:py-36 xl:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:gap-20`
const intro = 'flex flex-col gap-4'
const sideHeading = 'font-display text-4xl leading-[1.1] font-normal italic sm:text-[2.75rem]'

export default function Care() {
  return (
    <>
      <JsonLd data={[ORGANIZATION, CARE_SERVICE]} />
      <Navbar />
      <main className="bg-ink font-caslon text-cream">
        <header className="grid lg:grid-rows-[minmax(680px,auto)] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className={`${pad} flex flex-col justify-center gap-7 pt-36 pb-16 lg:py-0 lg:pr-16`}>
            <p className={label}>Care</p>
            <h1 className="font-display text-5xl leading-[1.02] font-normal text-balance sm:text-7xl xl:text-[5rem]">
              Every kind of care, <i className="text-champagne">arranged.</i>
            </h1>
            <p className="max-w-[30rem] text-lg leading-relaxed text-mist sm:text-[19px]">
              Tell us what you need. We find the right doctor and the right price, then handle every detail along the way.
            </p>
          </div>
          <img
            src={sheet.src}
            srcSet={`${sheetSmall.src} 960w, ${sheet.src} 1122w`}
            sizes="(min-width: 1024px) 45vw, 100vw"
            fetchPriority="high"
            alt="A thin silky sheet of translucent claret liquid folding in mid-air, edged with gold"
            className="aspect-[4/3] w-full object-cover object-[50%_65%] lg:aspect-auto lg:size-full"
          />
        </header>

        <section aria-labelledby="what-we-do" className={`${split} border-t border-rule`}>
          <div className={intro}>
            <p className={label}>What we do</p>
            <h2 id="what-we-do" className={sideHeading}>One team, start to finish</h2>
          </div>
          <div className="grid sm:grid-cols-2 sm:gap-x-16">
            {SERVICES.map(({ title, body }) => (
              <div key={title} className="flex flex-col gap-2.5 border-t border-champagne/60 pt-6 pb-12">
                <h3 className="font-display text-3xl font-normal">{title}</h3>
                <p className="text-[17px] leading-[1.7] text-mist">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-labelledby="what-we-cover" className={`${pad} flex flex-col gap-16 border-t border-rule py-24 sm:py-36`}>
          <div className={intro}>
            <p className={label}>What we cover</p>
            <h2 id="what-we-cover" className="font-display text-5xl leading-[1.05] font-normal text-balance sm:text-[4rem]">
              From a blood test <i className="text-champagne">to surgery.</i>
            </h2>
          </div>
          <div className="grid gap-14 md:grid-cols-3">
            {TIERS.map(({ tier, outcomes }) => (
              <div key={tier} className="flex flex-col gap-6">
                <h3 className={`${label} border-b border-champagne/60 pb-3.5`}>{tier}</h3>
                {outcomes.map(([name, detail]) => (
                  <div key={name}>
                    <p className="font-display text-[26px]">{name}</p>
                    <p className="mt-1.5 text-[15px] text-mist">{detail}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="font-display text-2xl text-champagne italic sm:text-3xl">
            Don’t see it? If it can be planned, we can arrange it.
          </p>
        </section>

        <section aria-labelledby="standards" className={`${split} bg-velvet`}>
          <div className={intro}>
            <p className={label}>Our standards</p>
            <h2 id="standards" className={sideHeading}>What we hold every partner to</h2>
          </div>
          <div className="grid gap-12 md:grid-cols-3">
            {STANDARDS.map(({ title, body }) => (
              <div key={title} className="flex flex-col gap-3 border-t border-champagne/60 pt-5">
                <h3 className="font-display text-[28px] font-normal">{title}</h3>
                <p className="leading-[1.7] text-cream/85">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <nav aria-label="Get started" className={`${pad} grid gap-8 py-24 sm:py-36 md:grid-cols-2`}>
          {PATHS.map(({ label: name, href, note }) => (
            <a
              key={name}
              href={href}
              className="flex flex-col gap-3 border border-champagne/85 p-8 transition-colors hover:bg-champagne/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne sm:p-12"
            >
              <span className="font-display text-4xl sm:text-[2.75rem]">{name} <span aria-hidden="true" className="text-champagne">→</span></span>
              <span className="text-[17px] text-mist">{note}</span>
            </a>
          ))}
        </nav>
      </main>
      <Footer />
    </>
  )
}
