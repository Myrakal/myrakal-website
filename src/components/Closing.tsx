import { TALK_WITH_US_HREF } from '@/lib/contact'
import horizon from '@/assets/liquid-horizon.webp'
import horizonSmall from '@/assets/liquid-horizon-960.webp'

export function Closing() {
  return (
    <section className="relative isolate flex min-h-[620px] flex-col items-center justify-start gap-5 overflow-hidden bg-ink px-4 pt-24 pb-16 text-center">
      <img
        src={horizon.src}
        srcSet={`${horizonSmall.src} ${horizonSmall.width}w, ${horizon.src} ${horizon.width}w`}
        sizes="100vw"
        alt="A dark claret sea meeting a bright gold horizon glow"
        loading="lazy"
        className="absolute inset-0 -z-20 size-full object-cover object-[50%_70%]"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-ink/25" />
      <h2 className="font-display text-4xl text-cream italic sm:text-7xl">The art of vitality.</h2>
      <p className="font-caslon text-xs tracking-[0.3em] text-champagne uppercase sm:text-[13px]">We&apos;ll take it from here.</p>
      <a
        href={TALK_WITH_US_HREF}
        className="mt-4 border border-champagne/85 bg-ink/35 px-10 py-3.5 font-caslon text-xs tracking-[0.28em] text-champagne uppercase backdrop-blur-sm transition-colors hover:bg-champagne hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne sm:text-[13px]"
      >
        Talk with us<span className="sr-only"> (opens email)</span>
      </a>
    </section>
  )
}
