import wordmark from '@/assets/myrakal-wordmark.svg'

const SECTIONS = [
  ['Care', '/care'],
  ['Individual', '/individual'],
  ['Business', '/business'],
  ['Contact', '/contact/'],
]

const LEGAL = [
  ['Privacy Policy', '/privacy/'],
  ['Terms of Service', '/terms/'],
  ['Accessibility', '/accessibility/'],
]

const link =
  'underline-offset-4 hover:text-champagne hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne'

const group = 'flex flex-col gap-3 text-xs tracking-[0.26em] text-cream uppercase'

export function Footer() {
  return (
    <footer className="border-t border-rule bg-ink px-6 pt-20 pb-12 font-caslon text-mist sm:px-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <img src={wordmark.src} alt="Myrakal" className="h-8 w-auto opacity-90 sm:h-9" />
            <a href="mailto:eshaansood@myrakal.com" className={`block text-[15px] ${link}`}>
              eshaansood@myrakal.com
            </a>
            <p className="text-[15px]">Chicago, Illinois</p>
          </div>
          <div className="flex flex-wrap gap-x-10 gap-y-8 sm:gap-x-20">
            <nav aria-label="Sections" className={group}>
              {SECTIONS.map(([name, href]) => (
                <a key={href} href={href} className={link}>
                  {name}
                </a>
              ))}
            </nav>
            <nav aria-label="Legal" className={group}>
              {LEGAL.map(([name, href]) => (
                <a key={href} href={href} className={link}>
                  {name}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <div className="max-w-3xl space-y-3 border-t border-rule pt-8 leading-relaxed">
          <p className="text-[15px] text-cream">
            Not for emergencies. If you think you may have a medical emergency, call 911 or your local emergency number.
          </p>
          <p className="text-sm">
            Information on this website is not medical advice, diagnosis, or treatment. Clinical decisions are made by
            licensed doctors.
          </p>
        </div>

        <p className="text-xs tracking-[0.2em] uppercase">© {new Date().getFullYear()} Myrakal Inc. All rights reserved.</p>
      </div>
    </footer>
  )
}
