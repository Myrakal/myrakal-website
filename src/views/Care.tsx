import { Footer } from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type Outcome = { name: string; detail: string }

const TIERS: { tier: string; outcomes: Outcome[] }[] = [
  {
    tier: 'Everyday',
    outcomes: [
      { name: 'Know your numbers', detail: 'Lab tests and bloodwork, ordered and read with you.' },
      { name: 'Your everyday medicine', detail: 'Prescriptions, sourced for the best price and delivered.' },
      { name: 'A doctor’s opinion', detail: 'Consults and second opinions from licensed doctors.' },
      { name: 'See clearly', detail: 'Imaging, including MRI, CT and ultrasound.' },
    ],
  },
  {
    tier: 'Ongoing',
    outcomes: [
      { name: 'Your smile', detail: 'Dental care, from cleanings to full restorations.' },
      { name: 'Starting a family', detail: 'IVF, clinics and fertility medication.' },
      { name: 'Staying on track', detail: 'Recurring care and follow-ups, kept in one place.' },
    ],
  },
  {
    tier: 'Major',
    outcomes: [
      { name: 'Your face and body', detail: 'Rhinoplasty, eyelid surgery and facelifts.' },
      { name: 'Your hair', detail: 'Hair transplants and aftercare.' },
      { name: 'Back on your feet', detail: 'Joint and orthopedic surgery.' },
    ],
  },
]

const STANDARDS = [
  { title: 'Clinics', body: 'We vet every clinic before we work with it, and decline those that fall short.' },
  { title: 'Doctors', body: 'A licensed doctor reviews and approves every plan before anything is arranged.' },
  { title: 'Protection', body: 'What is covered if something goes wrong is set out in your plan before you commit.' },
]

const PATHS = [
  { label: 'For yourself', href: '/chat/', note: 'Start with a doctor’s review.' },
  { label: 'For your team', href: '/contact', note: 'Care as a benefit for your people.' },
]

export default function Care() {
  return (
    <>
      <Navbar />
      <main className="bg-cream text-velvet-deep">
        <header className="bg-background text-foreground">
          <div className="mx-auto max-w-4xl px-6 pt-40 pb-20 sm:px-12">
            <h1 className="font-display text-5xl font-normal sm:text-7xl">Every kind of care, arranged.</h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Tell us what you need. We find where it should happen and handle the rest.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-4xl space-y-16 px-6 pt-20 sm:px-12">
          {TIERS.map(({ tier, outcomes }) => (
            <section key={tier} aria-labelledby={`tier-${tier}`}>
              <h2 id={`tier-${tier}`} className="font-grotesk text-xs font-normal tracking-[0.28em] text-velvet uppercase">
                {tier}
              </h2>
              <Accordion className="mt-4">
                {outcomes.map(({ name, detail }) => (
                  <AccordionItem key={name} value={name} className="border-velvet/20">
                    <AccordionTrigger className="py-5 focus-visible:ring-velvet font-display text-3xl font-normal text-velvet-deep hover:no-underline sm:text-4xl">
                      {name}
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 text-base text-velvet">{detail}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
          <p className="font-display text-2xl text-velvet italic">
            Don’t see it? If it can be planned, we can arrange it.
          </p>
        </div>

        <section aria-labelledby="standards" className="mx-auto mt-32 max-w-4xl px-6 sm:px-12">
          <h2 id="standards" className="font-display text-4xl font-normal">Our standards</h2>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {STANDARDS.map(({ title, body }) => (
              <div key={title}>
                <h3 className="font-grotesk text-xs font-normal tracking-[0.28em] text-velvet uppercase">{title}</h3>
                <p className="mt-3 text-velvet">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <nav aria-label="Get started" className="mx-auto grid max-w-4xl gap-px px-6 py-32 sm:grid-cols-2 sm:px-12">
          {PATHS.map(({ label, href, note }) => (
            <a key={label} href={href} className="group border-t border-velvet/20 py-8 focus-visible:outline-2 focus-visible:outline-velvet">
              <span className="block font-display text-4xl group-hover:italic">{label}</span>
              <span className="mt-2 block text-velvet">{note}</span>
            </a>
          ))}
        </nav>
      </main>
      <Footer />
    </>
  )
}
