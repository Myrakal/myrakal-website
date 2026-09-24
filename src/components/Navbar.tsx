import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

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
        scrolled ? 'justify-start' : 'justify-center'
      }`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex min-w-0 items-center gap-2 sm:gap-4"
      >
        {scrolled && (
          <img
            src="/myrakal-logo.png"
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
            Medical tourism made easy
          </motion.span>
        ) : (
          <img
            key="wordmark"
            src="/myrakal-wordmark.png"
            alt="Myrakal"
            className="h-6 w-auto sm:h-9 lg:h-12"
          />
        )}
      </motion.div>
    </header>
  )
}
