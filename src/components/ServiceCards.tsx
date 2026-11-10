const SERVICES = [
  ['Dental', 'Implants, All-on-4, full-mouth work and veneers.'],
  ['Cosmetic', 'Rhinoplasty, eyelid surgery, facelifts and other elective procedures.'],
]

export function ServiceCards() {
  return (
    <section aria-labelledby="services" className="bg-ink px-6 py-24 sm:px-12 lg:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 text-center">
        <div className="flex flex-col items-center gap-6">
          <p className="font-caslon text-xs tracking-[0.32em] text-champagne uppercase">What we handle</p>
          <h2 id="services" className="max-w-3xl font-display text-4xl leading-tight text-cream sm:text-6xl">
            Start with the <i className="text-champagne">big bills.</i>
          </h2>
        </div>
        <ul className="grid w-full gap-px bg-rule md:grid-cols-2">
          {SERVICES.map(([title, body]) => (
            <li key={title} className="flex flex-col items-center gap-4 bg-ink px-6 py-10 md:px-10">
              <h3 className="font-display text-3xl text-cream">{title}</h3>
              <p className="max-w-sm font-caslon text-lg leading-relaxed text-mist">{body}</p>
            </li>
          ))}
        </ul>
        <p className="max-w-2xl font-caslon text-lg leading-relaxed text-mist">
          Fertility, other procedures, prescriptions and more. If insurance won't cover it, just ask.
        </p>
      </div>
    </section>
  )
}
