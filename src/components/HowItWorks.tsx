import { ArrowRight, Globe as GlobeIcon, Stethoscope } from 'lucide-react'

const STEPS = [
  {
    number: '1',
    title: 'Select your country',
    description:
      "Choose where you'd like to receive care, based on where you're eligible to go.",
  },
  {
    number: '2',
    title: 'Select your doctor',
    description: "Browse vetted specialists and pick who's right for you.",
  },
]

export function HowItWorks() {
  return (
    <section className="flex min-h-screen items-center bg-charcoal px-6 py-20 sm:px-12">
      <div className="mx-auto grid w-full max-w-[100rem] grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-20">
        <div className="flex flex-col gap-10">
          <span className="text-base font-medium tracking-[0.2em] text-cream/50 uppercase">
            How it works
          </span>
          <h2 className="text-6xl font-medium text-cream sm:text-7xl">
            Care made <span className="italic">simple.</span>
          </h2>
          <p className="max-w-lg text-2xl text-cream/60">
            We get you the most reputed doctors in the country you choose.
          </p>
          <ol className="mt-4 flex flex-col gap-10">
            {STEPS.map((step) => (
              <li key={step.number} className="flex gap-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-lg text-cream">
                  {step.number}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-medium text-cream">
                    {step.title}
                  </h3>
                  <p className="text-xl text-cream/60">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-lg rounded-3xl border border-cream/10 bg-cream/5 p-8 shadow-2xl">
            <div className="mb-8 flex gap-2">
              <span className="size-3 rounded-full bg-cream/20" />
              <span className="size-3 rounded-full bg-cream/20" />
              <span className="size-3 rounded-full bg-cream/20" />
            </div>
            <div className="flex items-center justify-center gap-8 py-20">
              <div className="flex size-28 items-center justify-center rounded-full bg-primary/15">
                <GlobeIcon className="size-12 text-primary" />
              </div>
              <ArrowRight className="size-8 text-cream/30" />
              <div className="flex size-28 items-center justify-center rounded-full bg-primary/15">
                <Stethoscope className="size-12 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
