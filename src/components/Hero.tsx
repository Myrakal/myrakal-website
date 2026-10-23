import ampoule from '@/assets/hero-ampoule.webp'
import ampouleSmall from '@/assets/hero-ampoule-960.webp'
import wordmark from '@/assets/myrakal-wordmark.svg'

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col items-center overflow-hidden bg-charcoal px-4 pt-24 pb-12 text-center sm:px-8 sm:pb-16">
      <img
        src={ampoule.src}
        srcSet={`${ampouleSmall.src} 960w, ${ampoule.src} 1672w`}
        sizes="100vw"
        alt="A sealed glass ampoule of claret liquid with an engraved gold band, resting on red linen"
        fetchPriority="high"
        className="absolute inset-0 -z-20 size-full object-cover object-[30%_50%]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-linear-to-b from-charcoal/60 via-transparent via-30% to-charcoal/80"
      />
      <div className="flex w-full flex-1 items-center justify-center py-6">
        <img
          src={wordmark.src}
          alt=""
          className="pointer-events-none w-[min(92vw,1080px,120svh)] opacity-95"
        />
      </div>
      <h1 className="font-display text-2xl text-champagne italic sm:text-3xl">Healthcare, as it should be</h1>
      <p className="mt-3 max-w-md font-grotesk text-xs tracking-[0.2em] text-cream/80 uppercase">
        The best care, at the best price. Anywhere.
      </p>
      <a
        href="/chat/"
        className="mt-8 bg-champagne px-7 py-3.5 font-grotesk text-xs tracking-[0.25em] text-charcoal uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
      >
        Talk with us
      </a>
    </section>
  )
}
