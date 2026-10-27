import { TALK_WITH_US_HREF } from '@/lib/contact'
import ampoule from '@/assets/scene-ampoule-open.webp'
import ampouleSmall from '@/assets/scene-ampoule-open-960.webp'

export function Closing() {
  return (
    <section className="relative isolate flex min-h-[90svh] flex-col items-center justify-end overflow-hidden bg-charcoal px-4 pt-24 pb-16 text-center">
      <img
        src={ampoule.src}
        srcSet={`${ampouleSmall.src} 960w, ${ampoule.src} 1672w`}
        sizes="100vw"
        alt="The same ampoule, now opened, its glass tip snapped off and resting beside it"
        loading="lazy"
        className="absolute inset-0 -z-20 size-full object-cover object-[30%_50%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-charcoal/55" />
      <h2 className="font-display text-4xl text-cream italic sm:text-6xl">The art of vitality.</h2>
      <p className="mt-4 font-grotesk text-xs tracking-[0.3em] text-cream/80 uppercase">We&apos;ll take it from here.</p>
      <a
        href={TALK_WITH_US_HREF}
        className="mt-8 border border-champagne/85 bg-charcoal/35 px-10 py-3.5 font-caslon text-xs tracking-[0.28em] text-champagne uppercase backdrop-blur-sm transition-colors hover:bg-champagne hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne sm:text-[13px]"
      >
        Talk with us<span className="sr-only"> (opens email)</span>
      </a>
    </section>
  )
}
