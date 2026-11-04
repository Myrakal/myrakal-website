import { EMAIL_HREF, SMS_HREF } from '@/lib/contact'

const TEXT_LINK_CLASSES =
  'cursor-pointer border border-champagne/85 bg-ink/35 px-10 py-3.5 font-caslon text-xs tracking-[0.28em] text-champagne uppercase backdrop-blur-sm transition-colors hover:bg-champagne hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne sm:text-[13px]'

export function TextUsButton({ className = '', showEmailFallback = false }: { className?: string; showEmailFallback?: boolean }) {
  const textLink = (
    <a href={SMS_HREF} className={`${TEXT_LINK_CLASSES} ${showEmailFallback ? '' : className}`}>
      Text us!
    </a>
  )

  if (!showEmailFallback) return textLink

  return (
    <span className={`flex flex-col items-center gap-3 ${className}`}>
      {textLink}
      <a
        href={EMAIL_HREF}
        className="font-caslon text-xs tracking-[0.16em] text-cream/80 underline decoration-champagne/60 underline-offset-4 transition-colors hover:text-champagne focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
      >
        Email instead
      </a>
    </span>
  )
}
