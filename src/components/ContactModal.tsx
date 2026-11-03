'use client'

import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react'
import { FORMSPREE_ENDPOINT } from '@/lib/contact'

type Status = 'idle' | 'sending' | 'success' | 'error'

const field =
  'w-full border border-champagne/60 bg-transparent px-3 py-2 text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne'
const label = 'font-caslon text-xs tracking-[0.26em] text-champagne uppercase'
const FOCUSABLE = 'button:not([disabled]), input:not([tabindex="-1"]), textarea'

export function ContactModal({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<Status>('idle')
  const dialog = useRef<HTMLDivElement>(null)
  const first = useRef<HTMLInputElement>(null)

  useEffect(() => {
    first.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') return onClose()
    if (e.key !== 'Tab' || !dialog.current) return
    const items = [...dialog.current.querySelectorAll<HTMLElement>(FOCUSABLE)]
    const edge = items[e.shiftKey ? 0 : items.length - 1]
    if (document.activeElement === edge) {
      e.preventDefault()
      items[e.shiftKey ? items.length - 1 : 0].focus()
    }
  }

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = Object.fromEntries(new FormData(e.currentTarget))
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      data-testid="contact-backdrop"
      onClick={onClose}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-ink/80 p-4"
    >
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md border border-champagne/60 bg-charcoal p-6 font-caslon text-cream sm:p-8"
      >
        <h2 id="contact-title" className="font-display text-3xl text-champagne italic">
          Talk with us
        </h2>
        {status === 'success' ? (
          <div className="mt-6">
            <p role="status">Thank you. We&apos;ll be in touch soon.</p>
            <button type="button" onClick={onClose} className={`${label} mt-6 underline underline-offset-4`}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className={label}>Name</span>
              <input ref={first} name="name" required autoComplete="name" className={field} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={label}>Email</span>
              <input name="email" type="email" required autoComplete="email" className={field} />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className={label}>Message</span>
              <textarea name="message" required rows={4} className={field} />
            </label>
            <div aria-hidden="true" className="absolute -left-[9999px]">
              <input name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" />
            </div>
            {status === 'error' && (
              <p role="alert" className="text-sm text-cream">
                Something went wrong. Please try again.
              </p>
            )}
            <div className="flex items-center justify-between gap-4">
              <button type="button" onClick={onClose} className={`${label} underline underline-offset-4`}>
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="border border-champagne/85 px-8 py-3 font-caslon text-xs tracking-[0.26em] text-champagne uppercase transition-colors hover:bg-champagne hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne disabled:opacity-60"
              >
                {status === 'sending' ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
