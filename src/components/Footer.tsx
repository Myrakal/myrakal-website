import { TalkFallback } from '@/components/TalkFallback'
import wordmark from '@/assets/myrakal-wordmark.svg'

const LINKS = [
  ['Care', '/care'],
  ['Individual', '/individual'],
  ['Business', '/business'],
  ['Privacy Policy', '/privacy/'],
  ['Terms of Service', '/terms/'],
  ['Contact', '/contact/'],
  ['Accessibility', '/accessibility/'],
]

const link =
  'underline-offset-4 hover:text-cream hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne'

export function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-charcoal px-6 pt-16 pb-10 font-grotesk text-cream/70 sm:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-5">
            <img src={wordmark.src} alt="Myrakal" className="h-8 w-auto opacity-90 sm:h-10" />
            <a href="mailto:eshaansood@myrakal.com" className={`block text-sm ${link}`}>
              eshaansood@myrakal.com
            </a>
            <TalkFallback />
          </div>
          <nav aria-label="Sections, company and legal" className="flex flex-wrap gap-x-8 gap-y-3 text-xs tracking-[0.2em] uppercase">
            {LINKS.map(([name, href]) => (
              <a key={href} href={href} className={link}>
                {name}
              </a>
            ))}
          </nav>
        </div>

        <div className="max-w-3xl space-y-3 text-sm leading-relaxed">
          <p className="text-cream">
            Not for emergencies. If you think you may have a medical emergency, call 911 or your local emergency number.
          </p>
          <p>
            Information on this website is not medical advice, diagnosis, or treatment. Clinical decisions are made by
            licensed doctors.
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-cream/10 pt-6 text-xs tracking-[0.15em] uppercase sm:flex-row sm:justify-between">
          <span>© {new Date().getFullYear()} Myrakal Inc. All rights reserved.</span>
          <span>Chicago, Illinois</span>
        </div>
      </div>
    </footer>
  )
}
