import { TextUsButton } from '@/components/TextUsButton'

export function Closing() {
  return (
    <section className="flex flex-col items-center gap-5 border-t border-rule bg-ink px-4 py-24 text-center">
      <h2 className="font-display text-4xl text-cream italic sm:text-7xl">Making the system better.</h2>
      <p className="font-caslon text-xs tracking-[0.3em] text-champagne uppercase sm:text-[13px]">One text at a time.</p>
      <TextUsButton className="mt-4" showEmailFallback />
    </section>
  )
}
