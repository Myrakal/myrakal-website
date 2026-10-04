import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import logo from '@/assets/myrakal-logo.png'
import wordmark from '@/assets/myrakal-wordmark.png'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex bg-primary px-4 py-3 sm:px-12 sm:py-5 ${
        scrolled ? 'justify-start pr-36 sm:pr-80' : 'justify-center'
      }`}
    >
      <motion.a
        href="/"
        aria-label="Myrakal home"
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex min-w-0 items-center gap-2 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground sm:gap-4"
      >
        {scrolled && (
          <img
            src={logo}
            alt=""
            className="h-8 w-auto shrink-0 sm:h-12 lg:h-16"
          />
        )}
        {scrolled ? (
          <motion.span
            key="tagline"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="truncate text-sm font-medium text-primary-foreground sm:text-lg lg:text-2xl"
          >
            Cross-border healthcare made easy
          </motion.span>
        ) : (
          <img
            key="wordmark"
            src={wordmark}
            alt="Myrakal"
            className="h-6 w-auto sm:h-9 lg:h-12"
          />
        )}
      </motion.a>
      <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-4 sm:right-12 sm:gap-6">
        <a
          href="/clinics/"
          aria-current={window.location.pathname.startsWith('/clinics') ? 'page' : undefined}
          className="hidden text-base font-medium text-primary-foreground underline-offset-4 hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary-foreground sm:block lg:text-lg"
        >
          For clinics
        </a>
        <a
          href="/#waitlist"
          className="rounded-full bg-primary-foreground px-4 py-1.5 text-sm font-medium whitespace-nowrap text-primary transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground sm:px-5 sm:py-2 sm:text-base"
        >
          Join waitlist
        </a>
      </div>
    </header>
  )
}
