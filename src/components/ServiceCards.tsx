const SERVICES: [string, string, string?][] = [
  ['Dental', 'Implants, All-on-4, full-mouth work and veneers.', '/dental'],
  ['Cosmetic', 'Rhinoplasty, eyelid surgery, facelifts and other elective procedures.', '/cosmetic'],
]

export function ServiceCards() {
  return (
    <section aria-labelledby="services" className="bg-ink px-6 py-24 sm:px-12 lg:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 text-center">
        <div className="flex flex-col items-center gap-6">
          <p className="font-caslon text-xs tracking-[0.32em] text-champagne uppercase">What we handle</p>
          <h2 id="services" className="max-w-3xl font-display text-4xl leading-tight text-cream sm:text-6xl">
            Starting with the <i className="text-champagne">big bills.</i>
          </h2>
        </div>
        <ul className="grid w-full gap-px bg-rule md:grid-cols-2">
          {SERVICES.map(([title, body, href]) => (
            <li key={title} className={`relative flex flex-col items-center gap-4 bg-ink px-6 py-10 md:px-10 ${href ? 'group transition-colors hover:bg-velvet-deep' : ''}`}>
              <h3 className="font-display text-3xl text-cream">
                {href ? (
                  <a
                    href={href}
                    className="transition-colors group-hover:text-champagne after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-champagne"
                  >
                    {title}
                  </a>
                ) : (
                  title
                )}
              </h3>
              <p className="max-w-sm font-caslon text-lg leading-relaxed text-mist">{body}</p>
              {href && (
                <span aria-hidden="true" className="mt-2 border-b border-champagne/60 pb-1 font-caslon text-xs tracking-[0.28em] text-champagne uppercase transition-colors group-hover:border-champagne">
                  See options →
                </span>
              )}
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
