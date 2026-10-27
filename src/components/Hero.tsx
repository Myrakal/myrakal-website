import liquid from '@/assets/hero-liquid.webp'
import liquidSmall from '@/assets/hero-liquid-960.webp'
import wordmark from '@/assets/myrakal-wordmark.svg'
import { HeroVideo } from '@/components/HeroVideo'

const PILLARS = [
  ['Fully coordinated', 'Doctors, travel, insurance and aftercare,', 'all handled for you.'],
  ['For far less', 'The best care at the best price,', 'in the U.S. or abroad.'],
]

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col items-center overflow-hidden bg-charcoal px-4 pt-24 pb-12 text-center sm:px-8 sm:pb-16">
      <img
        src={liquid.src}
        srcSet={`${liquidSmall.src} 960w, ${liquid.src} 1916w`}
        sizes="100vw"
        alt="A ribbon of translucent claret liquid twisting through the dark, lit with gold"
        fetchPriority="high"
        className="absolute inset-0 -z-30 size-full object-cover"
      />
      <HeroVideo />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-charcoal/30 max-sm:bg-charcoal/45"
      />
      <div className="flex w-full flex-1 items-center justify-center py-6">
        <img
          src={wordmark.src}
          alt=""
          className="pointer-events-none w-[min(92vw,1080px,120svh)] opacity-95"
        />
      </div>
      <h1 className="font-display text-3xl text-champagne italic [text-shadow:0_2px_24px_var(--charcoal)] sm:text-[2.625rem]">
        Healthcare, as it should be
      </h1>
      <div className="mt-6 grid w-full max-w-[320px] font-caslon sm:max-w-[800px] sm:grid-cols-2">
        {PILLARS.map(([label, body, emphasis], i) => (
          <div
            key={label}
            className={`flex flex-col gap-2.5 px-6 py-3 sm:px-10 sm:py-0 ${i === 0 ? 'max-sm:border-b sm:border-r border-champagne/85' : ''}`}
          >
            <p className="text-xs tracking-[0.32em] text-champagne uppercase [text-shadow:0_1px_10px_var(--charcoal)]">{label}</p>
            <p className="mx-auto max-w-[300px] text-base leading-relaxed text-balance text-cream/95 [text-shadow:0_1px_14px_var(--charcoal)] sm:text-lg">
              {body} <i>{emphasis}</i>
            </p>
          </div>
        ))}
      </div>
      <a
        href="/dashboard"
        className="mt-8 border border-champagne/85 bg-charcoal/35 px-10 py-3.5 font-caslon text-xs tracking-[0.28em] text-champagne uppercase backdrop-blur-sm transition-colors hover:bg-champagne hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne sm:text-[13px]"
      >
        Talk with us
      </a>
    </section>
  )
}
