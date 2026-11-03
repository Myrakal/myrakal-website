const STEPS = [
  ['I', 'Text us', 'Talk to our autonomous system about what\'s expensive.'],
  ['II', 'We work it out', 'Our system runs your request against our healthcare pricing data.'],
  ['III', 'Get cheaper options', 'After a little analysis, we send back cheaper options, with the numbers, at no cost.'],
]

export function HowItWorks() {
  return (
    <section aria-labelledby="how-it-works" className="bg-ink px-6 py-24 sm:px-12 lg:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-14 text-center">
        <div className="flex flex-col items-center gap-6">
          <p className="font-caslon text-xs tracking-[0.32em] text-champagne uppercase">How it works</p>
          <h2 id="how-it-works" className="max-w-3xl font-display text-4xl leading-tight text-cream sm:text-6xl">
            You're one text away from <i className="text-champagne">paying less.</i>
          </h2>
        </div>
        <ol className="grid w-full gap-px bg-rule md:grid-cols-3">
          {STEPS.map(([numeral, title, body]) => (
            <li key={numeral} className="flex flex-col items-center gap-4 bg-ink px-6 py-10 md:px-10">
              <span aria-hidden="true" className="font-caslon text-xs tracking-[0.32em] text-champagne">
                {numeral}
              </span>
              <h3 className="font-display text-3xl text-cream">{title}</h3>
              <p className="max-w-xs font-caslon text-lg leading-relaxed text-mist">{body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
