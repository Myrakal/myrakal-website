import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'

const STEPS = [
  ['We set up alongside your plan.', 'No change to your carrier, network or plan design. Live in [X weeks].'],
  ['Your people get one team.', 'Employees text or call Myrakal for anything, from a prescription to a procedure.'],
  ['We find the best-value option before care is booked.', 'A licensed doctor reviews each case, and we show the employee their best options and what each costs.'],
  ['We arrange everything.', 'Booking, paperwork and follow-up, plus travel and stays when care away from home is the better choice. It’s always voluntary.'],
  ['You see the savings.', '[Monthly] reports show what was spent, what was saved, and how your people rated their care.'],
]

const BENEFITS = [
  { id: 'employees-get', title: 'What your employees get', items: [
    'One team for all of their care',
    'A licensed doctor reviewing their case',
    '[Lower or waived out-of-pocket costs when they choose the recommended option]',
    'Booking, forms and follow-ups handled for them',
    'Prescriptions at the best price, delivered',
    'Aftercare coordinated after every treatment',
  ] },
  { id: 'company-gets', title: 'What your company gets', items: [
    'Lower plan spend on [outpatient care, imaging, procedures and prescriptions]',
    'A benefit people actually use and talk about',
    'Clear reporting on spend, savings and satisfaction',
    'No plan redesign and no new network to manage',
  ] },
]

const FAQS = [
  ['Do we have to change our health plan?', 'No. Myrakal works alongside your current plan and carrier.'],
  ['Do employees have to travel for care?', 'Never. Most of what we arrange happens close to home. Travel is offered only when it’s clearly better, and the employee always decides.'],
  ['How is employee health data protected?', '[Describe your safeguards once confirmed with counsel.] [Employers see aggregate reports only; confirm with counsel.]'],
  ['How do you measure savings?', '[Method: e.g., price of the option chosen versus the employee’s default option.]'],
  ['How fast can we launch?', '[X weeks from signing.]'],
]

const label = 'font-grotesk text-[11px] font-light tracking-[0.28em] text-champagne uppercase'
const band = 'mx-auto max-w-6xl px-6 sm:px-12'
const h2 = 'font-display text-4xl font-normal sm:text-5xl'
const body = 'font-light text-muted-foreground'
const cta = 'inline-block border border-alabaster/40 px-8 py-4 font-display text-2xl transition-colors hover:bg-alabaster/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-alabaster'

function BookCall() {
  return <a href="/contact" className={cta}>Book a call <span aria-hidden="true">→</span></a>
}

export default function Business() {
  return (
    <>
      <Navbar />
      <main className="bg-velvet-deep text-cream">
        <header className={`${band} pt-40 pb-28 sm:pt-52`}>
          <p className={label}>For business</p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] font-normal text-balance sm:text-7xl">
            Better care for your people. Less spent by your plan.
          </h1>
          <p className={`mt-8 max-w-xl text-lg ${body}`}>
            Myrakal guides your employees to the right doctor at the best price, from lab work to surgery, and handles every detail. Your plan pays less, and your people feel looked after.
          </p>
          <div className="mt-12"><BookCall /></div>
        </header>

        <section aria-labelledby="problem" className="border-t border-champagne/20 bg-velvet">
          <div className={`${band} grid gap-12 py-28 lg:grid-cols-[1fr_2fr]`}>
            <h2 id="problem" className={h2}>The problem</h2>
            <p className={`text-lg ${body}`}>
              The same scan or surgery can cost several times more depending on where it’s done. Employees take the default option because no one shows them the difference, and you see the bill months later. [Add one sourced example, such as a hospital MRI versus an imaging center nearby.]
            </p>
          </div>
        </section>

        <section aria-labelledby="how-it-works" className={`${band} py-28`}>
          <h2 id="how-it-works" className={h2}>How it works</h2>
          <ol className="mt-16 grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="border-t border-champagne/30 pt-6">
                <span className="font-grotesk text-sm text-champagne">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-3 font-display text-2xl font-normal sm:text-3xl">{title}</h3>
                <p className={`mt-3 ${body}`}>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <div className="border-t border-champagne/20 bg-velvet">
          <div className={`${band} grid gap-16 py-28 md:grid-cols-2`}>
            {BENEFITS.map(({ id, title, items }) => (
              <section key={id} aria-labelledby={id}>
                <h2 id={id} className="font-display text-3xl font-normal sm:text-4xl">{title}</h2>
                <ul className="mt-10 space-y-4">
                  {items.map((item) => (
                    <li key={item} className={`border-t border-champagne/30 pt-4 ${body}`}>{item}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>

        <div className={`${band} grid gap-16 py-28 md:grid-cols-2`}>
          <section aria-labelledby="who">
            <h2 id="who" className={h2}>Who it’s for</h2>
            <p className={`mt-6 text-lg ${body}`}>Self-funded and level-funded employers with [X to Y] employees.</p>
          </section>
          <section aria-labelledby="pricing">
            <h2 id="pricing" className={h2}>Pricing</h2>
            <p className={`mt-6 text-lg ${body}`}>[Per employee per month, a share of verified savings, or both.]</p>
          </section>
        </div>

        <section aria-labelledby="questions" className="border-t border-champagne/20 bg-velvet">
          <div className={`${band} grid gap-12 py-28 lg:grid-cols-[1fr_2fr]`}>
            <h2 id="questions" className={h2}>Questions</h2>
            <dl className="space-y-10">
              {FAQS.map(([q, a]) => (
                <div key={q} className="border-t border-champagne/30 pt-6">
                  <dt className="font-display text-2xl">{q}</dt>
                  <dd className={`mt-3 ${body}`}>{a}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section aria-label="Book a call" className={`${band} py-28`}>
          <p className="max-w-4xl font-display text-4xl text-balance italic sm:text-6xl">
            Care your people will notice. Savings your plan will see.
          </p>
          <div className="mt-12"><BookCall /></div>
        </section>
      </main>
      <Footer />
    </>
  )
}
