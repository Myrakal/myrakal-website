'use client'

import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import logo from '@/assets/myrakal-logo.svg'
import { useSession } from '@/hooks/useSession'
import { getSupabase } from '@/lib/supabase'

const authLink =
  'font-grotesk text-[11px] tracking-[0.2em] whitespace-nowrap text-foreground uppercase underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne'

const SECTIONS = [
  ['Care', '/care'],
  ['Individual', '/individual'],
  ['Business', '/business'],
]

const navItem =
  'font-grotesk text-[11px] tracking-[0.2em] text-foreground uppercase transition-colors hover:text-champagne focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { user, loading } = useSession()
  const pathname = usePathname()
  const authClass = `${authLink} ${scrolled ? 'inline' : 'hidden sm:inline'}`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex px-4 py-3 transition-colors sm:px-12 sm:py-5 ${
        scrolled ? 'justify-start bg-background pr-56 sm:pr-[34rem]' : 'justify-center bg-transparent'
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
          {SECTIONS.map(([label, href]) => (
            <a key={href} href={href} aria-current={pathname === href ? 'page' : undefined} className={navItem}>
              {label}
            </a>
          ))}
        </nav>
        {loading ? null : user ? (
          <>
            <a href="/dashboard" className={`${authLink} hidden sm:inline`}>
              Dashboard
            </a>
            <button type="button" onClick={() => void getSupabase()?.auth.signOut().catch(() => {})} className={authClass}>
              Log out
            </button>
          </>
        ) : (
          <a href="/login" className={authClass}>
            Log in
          </a>
        )}
        <a
          href="/dashboard"
          className="border border-champagne/85 px-4 py-2 font-grotesk text-[11px] tracking-[0.2em] whitespace-nowrap text-champagne uppercase transition-colors hover:bg-champagne hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne sm:px-5"
        >
          Talk with us
        </a>
      </div>
    </header>
  )
}
