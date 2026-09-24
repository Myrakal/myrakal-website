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
      className={`fixed inset-x-0 top-0 z-50 flex bg-primary px-6 transition-[padding] duration-300 sm:px-12 ${
        scrolled ? 'justify-start py-5' : 'justify-center py-16'
      }`}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex items-center gap-4"
      >
        <img src="/myrakal-logo.png" alt="" className="h-28 w-auto" />
        {scrolled ? (
          <motion.span
            key="tagline"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-medium text-primary-foreground"
          >
            Medical tourism made easy
          </motion.span>
        ) : (
          <span
            key="wordmark"
            className="text-6xl font-medium text-primary-foreground"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Myrakal
          </span>
        )}
      </motion.div>
    </header>
  )
}
