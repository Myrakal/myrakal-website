'use client'

import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import logo from '@/assets/myrakal-logo.svg'

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
      className={`fixed inset-x-0 top-0 z-50 flex px-4 py-3 transition-colors sm:px-12 sm:py-5 ${
        scrolled ? 'justify-start bg-background pr-36 sm:pr-[30rem]' : 'justify-center bg-transparent'
      }`}
    >
      <motion.a
        href="/"
        aria-label="Myrakal home"
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex min-w-0 items-center gap-2 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground sm:gap-4"
      >
        <img
          src={logo.src}
          alt=""
          className="h-8 w-auto shrink-0 sm:h-12 lg:h-16"
        />
        {scrolled && (
          <motion.span
            key="tagline"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="truncate text-sm font-medium text-foreground sm:text-lg lg:text-2xl"
          >
            Healthcare, as it should be
          </motion.span>
        )}
      </motion.a>
      <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-4 sm:right-12 sm:gap-6">
        <nav aria-label="Primary" className="hidden items-center gap-6 sm:flex">
          {['Care', 'Individual', 'Business'].map((label) => (
            <button
              key={label}
              type="button"
              className="font-grotesk text-[11px] tracking-[0.2em] text-foreground uppercase transition-colors hover:text-champagne focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne"
            >
              {label}
            </button>
          ))}
        </nav>
        <a
          href="/chat/"
          className="rounded-full border border-champagne/60 px-4 py-2 font-grotesk text-[11px] tracking-[0.2em] whitespace-nowrap text-champagne uppercase transition-colors hover:bg-champagne/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne sm:px-5"
        >
          Talk with us
        </a>
      </div>
    </header>
  )
}
