import { EMAIL_HREF } from '@/lib/contact'

const CTA_CLASSES =
  'cursor-pointer border border-champagne/85 bg-ink/35 px-10 py-3.5 font-caslon text-xs tracking-[0.28em] text-champagne uppercase backdrop-blur-sm transition-colors hover:bg-champagne hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne sm:text-[13px]'

export function TextUsButton({ className = '' }: { className?: string }) {
  return (
    <a href={EMAIL_HREF} className={`${CTA_CLASSES} ${className}`}>
      Email us
    </a>
  )
}
