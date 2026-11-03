import logo from '@/assets/myrakal-logo.svg'
import { TextUsButton } from '@/components/TextUsButton'

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50 flex items-center justify-between px-4 py-3 sm:px-12 sm:py-5">
      <a
        href="/"
        aria-label="Myrakal home"
        className="focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      >
        <img src={logo.src} alt="" className="h-8 w-auto sm:h-12 lg:h-16" />
      </a>
      <TextUsButton className="px-5 py-2" />
    </header>
  )
}
