import liquid from '@/assets/hero-liquid.webp'
import liquidSmall from '@/assets/hero-liquid-960.webp'
import wordmark from '@/assets/myrakal-wordmark.svg'
import { HeroVideo } from '@/components/HeroVideo'
import { TextUsButton } from '@/components/TextUsButton'

export function Hero() {
  return (
    <section className="relative isolate flex min-h-svh flex-col items-center overflow-hidden bg-charcoal px-4 pt-24 pb-12 text-center sm:px-8 sm:pb-16">
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
      <div className="flex w-full flex-1 items-center justify-center py-6">
        <img src={wordmark.src} alt="" className="pointer-events-none w-[min(92vw,1080px,120svh)] opacity-95" />
      </div>
      <h1 className="font-display text-3xl text-champagne italic [text-shadow:0_2px_24px_var(--charcoal)] sm:text-[2.625rem]">
        Healthcare that costs less
      </h1>
      <p className="mt-5 max-w-xl font-caslon text-base leading-relaxed text-balance text-cream/95 [text-shadow:0_1px_14px_var(--charcoal)] sm:text-lg">
        Message us what you need. We&apos;ll get back to you with <i>free</i> data on cheaper options.
      </p>
      <TextUsButton className="mt-8" />
    </section>
  )
}
