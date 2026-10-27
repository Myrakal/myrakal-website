'use client'

import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
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

const menuItem = 'flex min-h-12 items-center border-b border-champagne/20 font-grotesk text-sm tracking-[0.2em] text-foreground uppercase focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-champagne'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { user, loading } = useSession()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const toggle = useRef<HTMLButtonElement>(null)
  const authClass = `${authLink} hidden sm:inline`

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setOpen(false)
      toggle.current?.focus()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 flex px-4 py-3 transition-colors sm:px-12 sm:py-5 ${
        scrolled ? 'justify-start bg-background pr-56 sm:pr-[34rem]' : 'justify-start bg-transparent sm:justify-center'
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
          className="rounded-full border border-alabaster/60 px-4 py-2 font-grotesk text-[11px] tracking-[0.2em] whitespace-nowrap text-alabaster uppercase transition-colors hover:bg-alabaster/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-alabaster sm:px-5"
        >
          Talk with us
        </a>
        <button
          ref={toggle}
          type="button"
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((value) => !value)}
          className="flex size-11 items-center justify-center rounded-full text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne sm:hidden"
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav aria-label="Mobile" className="absolute inset-x-0 top-full flex flex-col bg-background px-4 shadow-lg sm:hidden">
          {SECTIONS.map(([label, href]) => (
            <a key={href} href={href} aria-current={pathname === href ? 'page' : undefined} className={`${menuItem} aria-[current=page]:text-champagne`}>
              {label}
            </a>
          ))}
          {loading ? null : user ? (
            <>
              <a href="/dashboard" className={menuItem}>
                Dashboard
              </a>
              <button
                type="button"
                onClick={() => {
                  setOpen(false)
                  void getSupabase()?.auth.signOut().catch(() => {})
                }}
                className={`${menuItem} w-full`}
              >
                Log out
              </button>
            </>
          ) : (
            <a href="/login" className={menuItem}>
              Log in
            </a>
          )}
        </nav>
      )}
    </header>
  )
}
