import liquid from '@/assets/hero-liquid.webp'
import liquidSmall from '@/assets/hero-liquid-960.webp'
import wordmark from '@/assets/myrakal-wordmark.svg'
import { HeroVideo } from '@/components/HeroVideo'
import { PhoneMockup } from '@/components/PhoneMockup'
import { TextUsButton } from '@/components/TextUsButton'

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col items-center overflow-hidden bg-charcoal px-4 pt-24 pb-12 sm:px-8 sm:pb-16">
      <img
        src={liquid.src}
        srcSet={`${liquidSmall.src} 960w, ${liquid.src} 1916w`}
        sizes="(max-aspect-ratio: 16/9) 178svh, 100vw"
        alt="A ribbon of translucent claret liquid twisting through the dark, lit with gold"
        fetchPriority="high"
        className="absolute inset-0 -z-30 size-full object-cover"
      />
      <HeroVideo poster={liquid.src} />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-charcoal/30 max-sm:bg-charcoal/45" />
      <div className="mx-auto grid w-full max-w-6xl flex-1 items-center gap-12 py-6 lg:grid-cols-2 lg:gap-8">
        <div data-hero-copy className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <img src={wordmark.src} alt="" className="pointer-events-none w-[min(80vw,520px)] opacity-95" />
          <h1 className="mt-8 font-display max-sm:sr-only text-3xl text-champagne italic [text-shadow:0_2px_24px_var(--charcoal)] sm:text-[2.625rem]">
            Care costs too much. Text us.
          </h1>
          <p className="mt-5 max-w-xl font-caslon text-base leading-relaxed text-balance text-cream/95 [text-shadow:0_1px_14px_var(--charcoal)] sm:text-lg">
            If you're looking for cheaper healthcare, email us for early access
          </p>
          <TextUsButton className="mt-8 max-sm:hidden" />
        </div>
        <div data-hero-phone className="flex justify-center lg:justify-end">
          <PhoneMockup />
        </div>
      </div>
    </section>
  )
}
