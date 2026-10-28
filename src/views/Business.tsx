import horizon from '@/assets/liquid-horizon.webp'
import horizonSmall from '@/assets/liquid-horizon-960.webp'
import wave from '@/assets/liquid-wave.webp'
import waveSmall from '@/assets/liquid-wave-960.webp'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'

const STEPS = [
  ['I', 'We set up alongside your plan.', 'No change to your carrier, network or plan design. Live in two weeks.'],
  ['II', 'We give your people one team.', 'Employees text or call Myrakal for anything, from a prescription to a procedure.'],
  ['III', 'We find the best-value option first.', 'A licensed doctor reviews each case, and we show the employee their best options and what each costs.'],
  ['IV', 'We arrange everything.', 'Booking, paperwork and follow-up, plus travel and stays when care away from home is the better choice. It’s always voluntary.'],
  ['V', 'We show you the savings.', 'Reports, whenever you want them, show what was spent, what was saved, and how your people rated their care.'],
]

const BENEFITS = [
  { id: 'employees-get', title: 'What your employees get', items: [
    'One team for all of their care',
    'A licensed doctor reviewing their case',
    'Lower or waived out-of-pocket costs when they choose the recommended option',
    'Booking, forms and follow-ups handled for them',
    'Prescriptions at the best price, delivered',
    'Aftercare coordinated after every treatment',
  ] },
  { id: 'company-gets', title: 'What your company gets', items: [
    'Lower plan spend on everything we arrange, from prescriptions to procedures',
    'A benefit people actually use and talk about',
    'Clear reporting on spend, savings and satisfaction',
    'No plan redesign and no new network to manage',
  ] },
]

const FIT = [
  ['who', 'Who it’s for', 'Employers of any size, from small teams to large companies.'],
  ['pricing', 'Pricing', 'Pricing on request. We tailor it to your team and your plan.'],
]

const FAQS = [
  ['Do we have to change our health plan?', 'No. Myrakal works alongside your current plan and carrier.'],
  ['Do employees have to travel for care?', 'Never. Most of what we arrange happens close to home. Travel is offered only when it’s clearly better, and the employee always decides.'],
  ['How is employee health data protected?', 'We handle health information in line with HIPAA. You can see as much as you want about spend, savings and satisfaction across your team, but never an individual employee’s health details.'],
  ['How do you measure savings?', 'For every case, we compare what the care cost through Myrakal with what the same care would have cost where the employee would otherwise have gone, using your plan’s own prices. Every comparison appears in your reports.'],
  ['How fast can we launch?', 'Two weeks from signing.'],
]

const label = 'font-caslon text-xs font-normal tracking-[0.32em] text-champagne uppercase'
const band = 'mx-auto max-w-[1440px] px-6 sm:px-12 lg:px-24'
const body = 'leading-relaxed text-mist'
const cta = 'inline-block border border-champagne/85 bg-ink/35 px-10 py-3.5 font-caslon text-xs tracking-[0.28em] text-champagne uppercase transition-colors hover:bg-champagne hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne sm:text-[13px]'

function BookCall() {
  return <a href="/contact" className={cta}>Book a call</a>
}

export default function Business() {
  return (
    <>
      <Navbar />
      <main className="bg-ink font-caslon text-cream">
        <header className="grid lg:h-[min(780px,100svh)] lg:min-h-[680px] lg:grid-cols-[1.1fr_0.9fr]">
          <div className="flex flex-col items-start justify-center gap-7 px-6 pt-36 pb-16 sm:px-12 lg:py-24 lg:pr-16 lg:pl-24 min-[1440px]:pl-[calc((100vw-1440px)/2+6rem)]">
            <p className={label}>For business</p>
            <h1 className="font-display text-5xl leading-[1.04] font-normal text-balance sm:text-7xl">
              Better care for your people. <i className="text-champagne">Less spent by your plan.</i>
            </h1>
            <p className={`max-w-xl text-lg sm:text-[19px] ${body}`}>
              Myrakal guides your employees to the right doctor at the best price, from lab work to surgery, and handles every detail. Your plan pays less, and your people feel looked after.
            </p>
            <div className="mt-2"><BookCall /></div>
          </div>
          <img
            src={wave.src}
            srcSet={`${waveSmall.src} 960w, ${wave.src} 1122w`}
            sizes="(min-width: 1024px) 45vw, 100vw"
            alt="A broad wave of translucent claret liquid curling gently, its crest lit with gold"
            fetchPriority="high"
            className="aspect-[4/3] w-full object-cover object-[50%_70%] lg:aspect-auto lg:h-full lg:min-h-0"
          />
        </header>

        <section aria-labelledby="problem-label" className="border-t border-rule">
          <div className={`${band} grid gap-10 py-24 sm:py-36 lg:grid-cols-[360px_1fr] lg:gap-20`}>
            <div className="flex flex-col gap-4">
              <p id="problem-label" className={label}>The problem</p>
              <h2 className="font-display text-4xl leading-tight font-normal italic sm:text-[44px]">Same care, very different prices</h2>
            </div>
            <div className="flex max-w-3xl flex-col gap-6">
              <p className="font-display text-2xl leading-snug sm:text-3xl sm:leading-[1.4]">
                The same scan or surgery can cost several times more depending on where it’s done. Employees take the default option because no one shows them the difference, and you see the bill months later.
              </p>
              <p className={`text-lg ${body}`}>
                A brain MRI with contrast ranges from about <span className="text-champagne">$965 to over $3,000</span> depending on the hospital.
              </p>
              <a href="https://hub.jhu.edu/2021/12/13/radiological-services-compared-to-medicare/" className="text-[13px] text-mist/70 underline decoration-mist/40 underline-offset-4 hover:text-champagne">
                Source: Bai, Jiang and Makary, Radiology, 2021. Commercial prices at about 2,000 U.S. hospitals, 10th to 90th percentile.
              </a>
            </div>
          </div>
        </section>

        <section aria-labelledby="how-label" className="border-t border-rule">
          <div className={`${band} py-24 sm:py-36`}>
            <p id="how-label" className={label}>How it works</p>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] font-normal text-balance sm:text-6xl">
              Alongside your plan, <i className="text-champagne">not instead of it.</i>
            </h2>
            <ol className="mt-14 grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {STEPS.map(([numeral, title, text]) => (
                <li key={title} className="flex flex-col gap-2.5 border-t border-champagne/60 pt-6">
                  <span className="text-[13px] tracking-[0.32em] text-champagne">{numeral}</span>
                  <h3 className="font-display text-2xl font-normal sm:text-[28px]">{title}</h3>
                  <p className={body}>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <div className="bg-velvet">
          <div className={`${band} grid gap-16 py-24 sm:py-32 md:grid-cols-2 lg:gap-20`}>
            {BENEFITS.map(({ id, title, items }) => (
              <section key={id} aria-labelledby={id}>
                <h2 id={id} className={label}>{title}</h2>
                <ul className="mt-6 border-b border-champagne/60">
                  {items.map((item) => (
                    <li key={item} className="border-t border-champagne/60 py-4 text-lg">{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <div className={`${band} grid gap-12 pt-24 sm:pt-36 md:grid-cols-2 lg:gap-20`}>
          {FIT.map(([id, title, text]) => (
            <section key={id} aria-labelledby={id} className="flex flex-col gap-4 border-t border-rule pt-6">
              <h2 id={id} className={label}>{title}</h2>
              <p className="font-display text-2xl leading-snug sm:text-3xl">{text}</p>
            </section>
          ))}
        </div>

        <section aria-labelledby="questions" className={`${band} grid gap-8 py-24 sm:py-36 lg:grid-cols-[360px_1fr] lg:gap-20`}>
          <h2 id="questions" className={label}>Questions</h2>
          <dl className="border-b border-rule">
            {FAQS.map(([q, a]) => (
              <div key={q} className="flex flex-col gap-2.5 border-t border-rule py-6">
                <dt className="font-display text-2xl sm:text-[26px]">{q}</dt>
                <dd className={`text-[17px] ${body}`}>{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-label="Book a call" className="relative isolate min-h-[520px] overflow-hidden">
          <img
            src={horizon.src}
            srcSet={`${horizonSmall.src} 960w, ${horizon.src} 1672w`}
            sizes="100vw"
            alt=""
            loading="lazy"
            className="absolute inset-0 -z-20 size-full object-cover object-[50%_70%]"
          />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/25" />
          <div className={`${band} flex flex-col items-start gap-8 pt-20`}>
            <p className="max-w-4xl font-display text-4xl leading-[1.1] text-balance italic sm:text-6xl">
              Care your people will notice. Savings your plan will see.
            </p>
            <BookCall />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
