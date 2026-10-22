import ampoule from '@/assets/hero-ampoule.webp'
import wordmark from '@/assets/myrakal-wordmark.svg'

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col items-center justify-end overflow-hidden bg-charcoal px-4 pt-28 pb-12 text-center sm:px-8 sm:pb-16">
      <img
        src={ampoule}
        alt="A sealed glass ampoule of claret liquid with an engraved gold band, resting on red linen"
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover object-[30%_50%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-charcoal/60 via-transparent via-30% to-charcoal/80"
      />
      <img
        src={wordmark}
        alt=""
        className="pointer-events-none absolute top-1/2 left-1/2 w-[92vw] max-w-[1080px] -translate-x-1/2 -translate-y-1/2 opacity-95"
      />
      <h1 className="font-display text-2xl text-gold italic sm:text-3xl">Healthcare, but way cheaper</h1>
      <p className="mt-3 max-w-md font-grotesk text-xs tracking-[0.2em] text-cream/80 uppercase">
        The best care, at the best price. Anywhere.
      </p>
      <a
        href="/chat/"
        className="mt-8 bg-gold px-7 py-3.5 font-grotesk text-xs tracking-[0.25em] text-charcoal uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold"
      >
        Talk with us
      </a>
    </section>
  )
}
