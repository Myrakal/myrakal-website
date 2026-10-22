import ampoule from '@/assets/scene-ampoule-open.webp'
import ampouleSmall from '@/assets/scene-ampoule-open-960.webp'

export function Closing() {
  return (
    <section className="relative isolate flex min-h-[90svh] flex-col items-center justify-end overflow-hidden bg-charcoal px-4 pt-24 pb-16 text-center">
      <img
        src={ampoule}
        srcSet={`${ampouleSmall} 960w, ${ampoule} 1672w`}
        sizes="100vw"
        alt="The same ampoule, now opened, its glass tip snapped off and resting beside it"
        loading="lazy"
        className="absolute inset-0 -z-20 size-full object-cover object-[30%_50%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-linear-to-t from-charcoal/85 via-transparent via-50% to-transparent" />
      <h2 className="font-display text-4xl text-cream sm:text-5xl">We&apos;ll take it from here.</h2>
      <a
        href="/chat/"
        className="mt-8 bg-champagne px-7 py-3.5 font-grotesk text-xs tracking-[0.25em] text-charcoal uppercase transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
      >
        Talk with us
      </a>
    </section>
  )
}
