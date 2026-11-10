const PREVIEW = [
  ['All-on-4 implants', 'Chicago', 'Guadalajara'],
  ['Porcelain veneers, full set', 'Miami', 'Orlando'],
  ['Single dental implant', 'New York', 'Philadelphia'],
  ['Rhinoplasty', 'Los Angeles', 'Mexico City'],
]

function Redacted({ width }: { width: string }) {
  return <span aria-hidden="true" className={`inline-block h-3 ${width} rounded-sm bg-champagne/35 blur-[2px]`} />
}

export function MyrakalIndex() {
  return (
    <section aria-labelledby="myrakal-index" className="border-t border-rule bg-velvet-deep px-6 py-24 sm:px-12 lg:py-32">
      <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.15fr]">
        <div className="flex flex-col items-start gap-6">
          <p className="flex items-center gap-3 rounded-full border border-gold px-4 py-1.5 font-grotesk text-xs tracking-[0.28em] text-champagne uppercase">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-champagne motion-safe:animate-pulse" />
            Coming soon
          </p>
          <h2 id="myrakal-index" className="font-display text-4xl leading-tight text-cream sm:text-6xl">
            The Myrakal <i className="text-champagne">Index.</i>
          </h2>
          <p className="max-w-md font-caslon text-lg leading-relaxed text-mist">
            A public guide to what care really costs, built from real quotes. Compare prices by procedure and city, near you,
            across the U.S. and abroad.
          </p>
        </div>
        <div className="border border-gold/40 bg-ink font-grotesk">
          <div className="flex items-center justify-between gap-4 border-b border-gold/40 px-5 py-3 text-xs tracking-[0.2em] text-champagne uppercase">
            <span>Procedure</span>
            <span className="shrink-0">
              <span className="sm:hidden">Prices</span>
              <span className="hidden sm:inline">Your city / Best option</span>
            </span>
          </div>
          <ul>
            {PREVIEW.map(([procedure, home, abroad]) => (
              <li key={procedure} className="flex items-center justify-between gap-4 border-b border-rule px-5 py-4 last:border-b-0">
                <div className="flex min-w-0 flex-col">
                  <span className="text-cream">{procedure}</span>
                  <span className="text-xs text-mist">
                    {home} vs. {abroad}
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="sr-only">Prices hidden until launch</span>
                  <Redacted width="w-14 sm:w-20" />
                  <Redacted width="w-10 sm:w-16" />
                </div>
              </li>
            ))}
          </ul>
          <p className="border-t border-gold/40 px-5 py-3 text-xs tracking-[0.2em] text-mist uppercase">Prices unlock at launch</p>
        </div>
      </div>
    </section>
  )
}
