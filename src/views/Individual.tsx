import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'

const SCENARIOS = [
  'You’ve been quoted a price for a scan or procedure and it doesn’t feel right.',
  'You’re paying out of pocket, or your deductible is high.',
  'You’re starting something long, like IVF or a course of treatment, and want one team to run it.',
  'Your prescriptions cost more than they should.',
]

const STEPS = [
  ['Tell us what you need.', 'Start a conversation, with or without a diagnosis. Share any records, results and insurance details you have. Our intake only gathers information; it never gives advice.'],
  ['A licensed doctor reviews your case.', 'They confirm what you need and approve your options. Nothing is recommended before that review.'],
  ['You get one plan and one price.', 'We lay out your options, close to home or abroad, each with its full cost. You choose; nothing is booked until you say yes.'],
  ['We arrange everything.', 'Appointments, paperwork, and travel and stays when needed.'],
  ['We stay with you.', 'We follow up after treatment, coordinate aftercare, and keep your prescriptions coming at the best price.'],
]

const PRICES = [
  ['Doctor review', '$150', 'Credited toward any care you book through Myrakal'],
  ['Your plan', 'One all-in price', 'Quoted in full before you commit; covers everything listed in your plan'],
  ['Financing', 'Through your provider', 'Available through many of our providers; we’ll help you apply'],
  ['Insurance', 'Your plan’s terms', 'We use your coverage wherever it lowers what you pay'],
]

const INCLUDES = [
  'The procedure or treatment, and the doctor’s fees',
  'Tests, imaging and prescriptions',
  'Appointment booking and every form',
  'Flights, hotel and local transport, when care is away from home',
  'Aftercare and follow-up visits',
]

const FAQS: [string, React.ReactNode][] = [
  ['Do I need insurance?', 'No. We work with or without it. If you have coverage, we use it wherever it lowers your cost.'],
  ['Will I have to travel?', 'Only if it’s the better option for you. Much of what we arrange happens close to home.'],
  ['Does AI make medical decisions?', 'No. AI only gathers your information. A licensed doctor reviews and approves every plan.'],
  ['How quickly will I hear back?', 'Within 2 business days of completing intake.'],
  ['What if something goes wrong?', 'Your coordinator stays with you and works directly with your providers to resolve it. We’ll also tell you, before you commit, what your provider’s own policies cover.'],
  ['Is my information private?', <>Yes. Health details are shared only through Myrakal intake, as described in our <a href="/privacy/" className="underline underline-offset-4 hover:text-cream">Privacy Policy</a>.</>],
]

const label = 'font-grotesk text-[11px] font-light tracking-[0.28em] text-champagne uppercase'
const band = 'mx-auto max-w-6xl px-6 sm:px-12'
const h2 = 'font-display text-4xl font-normal sm:text-5xl'
const body = 'font-light text-muted-foreground'
const cta = 'inline-block border border-alabaster/40 px-8 py-4 font-display text-2xl transition-colors hover:bg-alabaster/10 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-alabaster'
const cell = 'border-b border-champagne/20 py-5 pr-4 align-top sm:pr-6'

const TalkWithUs = () => <a href="/chat/" className={cta}>Talk with us <span aria-hidden="true">→</span></a>

export default function Individual() {
  return (
    <>
      <Navbar />
      <main className="bg-velvet-deep text-cream">
        <header className={`${band} pt-40 pb-28 sm:pt-52`}>
          <p className={label}>For yourself</p>
          <h1 className="mt-6 max-w-4xl font-display text-5xl leading-[1.05] font-normal text-balance sm:text-7xl">One team for all of your care.</h1>
          <p className={`mt-8 mb-12 max-w-xl text-lg ${body}`}>Bring us anything, from a lab test to a surgery. We find the best doctor and the best price, handle every detail, and stay with you until you’re well.</p>
          <TalkWithUs />
        </header>

        <section aria-labelledby="for-you" className="border-t border-champagne/20 bg-velvet">
          <div className={`${band} grid gap-12 py-28 lg:grid-cols-[1fr_2fr]`}>
            <h2 id="for-you" className={h2}>Is this for you?</h2>
            <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
              {SCENARIOS.map((s) => <li key={s} className="border-t border-champagne/30 pt-6 font-display text-2xl">{s}</li>)}
            </ul>
          </div>
        </section>

        <section aria-labelledby="how-it-works" className={`${band} py-28`}>
          <h2 id="how-it-works" className={h2}>How it works for you</h2>
          <ol className="mt-16 space-y-12">
            {STEPS.map(([title, text], i) => (
              <li key={title} className="grid gap-4 border-t border-champagne/30 pt-6 md:grid-cols-[6rem_1fr_2fr]">
                <span className={label} aria-hidden="true">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-2xl font-normal sm:text-3xl">{title}</h3>
                <p className={body}>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="what-you-pay" className="border-t border-champagne/20 bg-velvet">
          <div className={`${band} py-28`}>
            <h2 id="what-you-pay" className={h2}>What you pay</h2>
            <div className="mt-14 overflow-x-auto">
              <table aria-labelledby="what-you-pay" className="w-full text-left text-sm sm:text-base">
                <thead><tr>{['Item', 'Price', 'Notes'].map((h) => <th key={h} scope="col" className={`${label} border-b border-champagne/20 pr-6 pb-4`}>{h}</th>)}</tr></thead>
                <tbody>
                  {PRICES.map(([item, price, note]) => (
                    <tr key={item}>
                      <th scope="row" className={`${cell} font-display text-lg font-normal sm:text-2xl`}>{item}</th>
                      <td className={`${cell} text-cream`}>{price}</td>
                      <td className={`${cell} ${body}`}>{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section aria-labelledby="includes" className={`${band} grid gap-12 py-28 lg:grid-cols-[1fr_2fr]`}>
          <h2 id="includes" className={h2}>What a plan can include</h2>
          <ul className="grid gap-x-12 gap-y-6 sm:grid-cols-2">
            {INCLUDES.map((item) => <li key={item} className={`border-t border-champagne/30 pt-4 ${body}`}>{item}</li>)}
          </ul>
        </section>

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

        <section aria-label="Get started" className={`${band} py-28 text-center`}>
          <p className="mb-12 font-display text-5xl sm:text-7xl"><i>Healthcare, as it should be.</i></p>
          <TalkWithUs />
        </section>
      </main>
      <Footer />
    </>
  )
}
