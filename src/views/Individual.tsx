import { TALK_WITH_US_HREF } from '@/lib/contact'
import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import sphere from '@/assets/liquid-sphere.webp'
import sphereSmall from '@/assets/liquid-sphere-960.webp'
import horizon from '@/assets/liquid-horizon.webp'
import horizonSmall from '@/assets/liquid-horizon-960.webp'

const SCENARIOS = [
  'You’ve been quoted a price for a scan or procedure and it doesn’t feel right.',
  'You’re paying out of pocket, or your deductible is high.',
  'You’re starting something long, like IVF or a course of treatment, and want one team to run it.',
  'Your prescriptions cost more than they should.',
]

const NUMERALS = ['I', 'II', 'III', 'IV', 'V']

const STEPS = [
  ['You tell us what you need.', 'Start a conversation, with or without a diagnosis. Share any records, results and insurance details you have. Our intake only gathers information; it never gives advice.'],
  ['A licensed doctor reviews your case.', 'They confirm what you need and approve your options. Nothing is recommended before that review.'],
  ['You get one plan and one price.', 'We lay out your options, close to home or abroad, each with its full cost. You choose; nothing is booked until you say yes.'],
  ['We book everything and pay your providers.', 'Appointments, paperwork, and travel and stays when needed. Once you approve your plan, you pay us, and we pay each provider.'],
  ['We stay with you.', 'We follow up after treatment, coordinate aftercare, and keep your prescriptions coming at the best price.'],
]

const PRICES = [
  ['Doctor review', '$50', 'Credited toward any care you book through Myrakal'],
  ['Your plan', 'One all-in price', 'Quoted in full before you commit; covers everything listed in your plan'],
  ['Financing', 'On request', 'Ask your coordinator about paying over time'],
  ['Insurance', 'Your coverage', 'We use your coverage wherever it lowers what you pay'],
]

const INCLUDES = [
  'Treatment and doctor’s fees',
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

const label = 'font-caslon text-xs tracking-[0.32em] text-champagne uppercase'
const band = 'mx-auto max-w-7xl px-6 sm:px-12 lg:px-24'
const split = `${band} grid gap-10 py-24 sm:py-36 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-20`
const h2 = 'mt-4 font-display text-4xl leading-tight font-normal italic sm:text-[2.75rem]'
const body = 'text-base leading-relaxed text-mist sm:text-[17px]'
const gold = 'border-champagne/60'
const cta = 'inline-block border border-champagne/85 bg-ink/35 px-10 py-3.5 font-caslon text-xs tracking-[0.28em] text-champagne uppercase transition-colors hover:bg-champagne hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne sm:text-[13px]'
const cell = `${gold} pt-6 pr-4 align-baseline sm:border-t sm:pr-8 sm:pb-6`

const TalkWithUs = () => (
  <a href={TALK_WITH_US_HREF} className={cta}>
    Talk with us<span className="sr-only"> (opens email)</span>
  </a>
)

const Intro = ({ id, title, heading }: { id: string; title: string; heading?: string }) => (
  <div>
    <h2 id={id} className={label}>{title}</h2>
    {heading && <p className={h2}>{heading}</p>}
  </div>
)

export default function Individual() {
  return (
    <>
      <Navbar />
      <main className="bg-ink font-caslon text-cream">
        <header className="grid lg:min-h-[680px] lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div className="flex flex-col items-start justify-center gap-7 px-6 pt-36 pb-16 sm:px-12 lg:pt-40 lg:pb-20 lg:pr-16 lg:pl-24">
            <p className={label}>For yourself</p>
            <h1 className="font-display text-5xl leading-[1.02] font-normal text-balance sm:text-7xl xl:text-[5rem]">One team for <i className="text-champagne">all of your care.</i></h1>
            <p className="max-w-[500px] text-lg leading-relaxed text-mist sm:text-[19px]">Bring us anything, from a lab test to a surgery. We find the best doctor and the best price, handle every detail, and stay with you until you’re well.</p>
            <div className="mt-2"><TalkWithUs /></div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto">
            <img src={sphere.src} srcSet={`${sphereSmall.src} 960w, ${sphere.src} 1448w`} sizes="(min-width: 1024px) 45vw, 100vw" alt="" fetchPriority="high" className="size-full scale-[1.35] object-cover object-[50%_45%]" />
          </div>
        </header>

        <section aria-labelledby="for-you" className="border-t border-rule">
          <div className={split}>
            <Intro id="for-you" title="Is this for you?" heading="If any of these sound familiar" />
            <ul className="grid gap-x-14 gap-y-10 sm:grid-cols-2">
              {SCENARIOS.map((s) => <li key={s} className={`border-t ${gold} pt-6 font-display text-2xl leading-snug sm:text-[26px]`}>{s}</li>)}
            </ul>
          </div>
        </section>

        <section aria-labelledby="how-it-works" className="border-t border-rule">
          <div className={`${band} py-24 sm:py-36`}>
            <h2 id="how-it-works" className={label}>How it works for you</h2>
            <p className="mt-4 font-display text-5xl leading-[1.05] sm:text-6xl">Five steps, <i className="text-champagne">one team.</i></p>
            <ol className="mt-14 border-b border-rule">
              {STEPS.map(([title, text], i) => (
                <li key={title} className="grid gap-3 border-t border-rule py-8 md:grid-cols-[6rem_minmax(0,1fr)_minmax(0,1.4fr)] md:gap-8">
                  <span aria-hidden="true" className="text-[13px] tracking-[0.32em] text-champagne">{NUMERALS[i]}</span>
                  <h3 className="font-display text-2xl font-normal sm:text-3xl">{title}</h3>
                  <p className={body}>{text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section aria-labelledby="what-you-pay" className="bg-velvet">
          <div className={split}>
            <Intro id="what-you-pay" title="What you pay" heading="One price, quoted in full" />
            <div className="overflow-x-auto">
              <table aria-labelledby="what-you-pay" className={`w-full border-b ${gold} text-left`}>
                <thead className="sr-only"><tr>{['Item', 'Price', 'Notes'].map((h) => <th key={h} scope="col">{h}</th>)}</tr></thead>
                <tbody>
                  {PRICES.map(([item, price, note]) => (
                    <tr key={item} className={`max-sm:grid max-sm:grid-cols-[1fr_auto] max-sm:border-t max-sm:pb-6 ${gold}`}>
                      <th scope="row" className={`${cell} font-display text-xl font-normal sm:text-[26px] sm:whitespace-nowrap`}>{item}</th>
                      <td className={`${cell} text-champagne max-sm:pr-0 sm:whitespace-nowrap ${price.startsWith('$') ? 'font-display text-2xl sm:text-3xl' : 'sm:text-[17px]'}`}>{price}</td>
                      <td className={`${cell} max-sm:col-span-2 max-sm:pt-2 text-sm leading-relaxed text-cream/85 sm:text-base`}>{note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section aria-labelledby="includes" className={split}>
          <Intro id="includes" title="What a plan can include" heading="Everything around your care" />
          <ul className="grid gap-x-14 gap-y-1 sm:grid-cols-2">
            {INCLUDES.map((item) => <li key={item} className="border-t border-rule py-4 text-lg">{item}</li>)}
          </ul>
        </section>

        <section aria-labelledby="questions" className={`${split} sm:pt-0`}>
          <Intro id="questions" title="Questions" />
          <dl className="border-b border-rule">
            {FAQS.map(([q, a]) => (
              <div key={q} className="border-t border-rule py-6">
                <dt className="font-display text-2xl sm:text-[26px]">{q}</dt>
                <dd className={`mt-2.5 ${body}`}>{a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-label="Get started" className="relative isolate flex h-[440px] flex-col items-center gap-7 overflow-hidden px-6 pt-16 text-center sm:h-[520px] sm:pt-20">
          <img src={horizon.src} srcSet={`${horizonSmall.src} 960w, ${horizon.src} 1672w`} sizes="100vw" alt="" loading="lazy" className="absolute inset-0 -z-20 size-full object-cover object-top" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/25" />
          <p className="font-display text-5xl italic sm:text-7xl">Healthcare, as it should be.</p>
          <TalkWithUs />
        </section>
      </main>
      <Footer />
    </>
  )
}
