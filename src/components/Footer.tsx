import wordmark from '@/assets/myrakal-wordmark.svg'

const LINKS = [
  ['Dental', '/dental'],
  ['Cosmetic', '/cosmetic'],
  ['Guides', '/guides'],
  ['How we verify', '/how-we-verify'],
  ['Insurance calculator', '/tools/dental-insurance-calculator'],
] as const

export function Footer() {
  return (
    <footer className="border-t border-rule bg-ink px-6 pt-16 pb-12 font-caslon text-mist sm:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8">
        <img src={wordmark.src} alt="" className="h-8 w-auto self-start opacity-90 sm:h-9" />
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-8 gap-y-3 text-[15px]">
            {LINKS.map(([label, href]) => (
              <li key={href}><a href={href} className="text-cream underline-offset-4 hover:text-champagne hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne">{label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="max-w-3xl space-y-3 leading-relaxed">
          <p className="text-[15px] text-cream">
            Not for emergencies. If you think you may have a medical emergency, call 911 or your local emergency number.
          </p>
          <p className="text-sm">Information on this website is not medical advice, diagnosis, or treatment.</p>
        </div>
        <p className="text-xs tracking-[0.2em] uppercase">© {new Date().getFullYear()} Myrakal Inc. All rights reserved.</p>
      </div>
    </footer>
  )
}
