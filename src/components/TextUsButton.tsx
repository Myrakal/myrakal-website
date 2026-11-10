'use client'

import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import { QuoteForm } from '@/components/QuoteForm'

const CTA_CLASSES =
  'cursor-pointer border border-champagne/85 bg-ink/35 px-10 py-3.5 font-caslon text-xs tracking-[0.28em] text-champagne uppercase backdrop-blur-sm transition-colors hover:bg-champagne hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne'

export function TextUsButton({ className = '' }: { className?: string }) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)
  const close = (sent = false) => {
    setOpen(false)
    if (sent) setMounted(false)
    trigger.current?.focus()
  }
  return (
    <>
      <button ref={trigger} type="button" aria-haspopup="dialog" onClick={() => {
          setMounted(true)
          setOpen(true)
        }} className={`${CTA_CLASSES} ${className}`}>
        Send your quote
      </button>
      {mounted && createPortal(<QuoteForm open={open} onClose={close} />, document.body)}
    </>
  )
}
