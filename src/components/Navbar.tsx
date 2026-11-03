'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import logo from '@/assets/myrakal-logo.svg'
import { TalkWithUs } from '@/components/TalkWithUs'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex justify-start px-4 py-3 transition-colors sm:px-12 sm:py-5 ${
        scrolled ? 'border-b border-rule bg-ink pr-56 sm:pr-[34rem]' : 'bg-transparent'
      }`}
    >
      <a
        href="/"
        aria-label="Myrakal home"
        className="flex min-w-0 items-center gap-2 focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground sm:gap-4"
      >
        <img
          src={logo.src}
          alt=""
          className="h-8 w-auto shrink-0 sm:h-12 lg:h-16"
        />
        {scrolled && (
          <motion.span
            initial={reduceMotion ? false : { width: 0, opacity: 0 }}
            animate={{ width: 'auto', opacity: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="hidden truncate font-display text-sm text-champagne italic sm:inline-block sm:text-lg lg:text-2xl"
          >
            Healthcare, as it should be
          </motion.span>
        )}
      </a>
      <div className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-4 sm:right-12 sm:gap-6">
        <TalkWithUs
          className="border border-champagne/85 px-4 py-2 font-caslon text-xs tracking-[0.26em] whitespace-nowrap text-champagne uppercase transition-colors hover:bg-champagne hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne sm:px-5"
        >
          Talk with us
        </TalkWithUs>
      </div>
    </header>
  )
}
