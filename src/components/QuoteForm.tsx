'use client'

import { type FormEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react'

import { CONTACT_EMAIL, FORMSPREE_ENDPOINT } from '@/lib/contact'

type Status = 'idle' | 'sending' | 'success' | 'error'

const FIELD = 'w-full border border-champagne/60 bg-ink px-3 py-2 text-cream focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne'
const LABEL = 'font-caslon text-xs tracking-[0.26em] text-champagne uppercase'
const FOCUSABLE = 'button:not([disabled]), input:not([tabindex="-1"]), select, textarea'
const SOURCES = ['Google or another search engine', 'An AI assistant', 'Reddit', 'Instagram or TikTok', 'A friend or family member', 'Other']

export function QuoteForm({ onClose }: { onClose: () => void }) {
  const [status, setStatus] = useState<Status>('idle')
  const dialog = useRef<HTMLDivElement>(null)
  const first = useRef<HTMLInputElement>(null)
  const pressedBackdrop = useRef(false)

  useEffect(() => {
    first.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previous
    }
  }, [])

  useEffect(() => {
    if (status === 'success') dialog.current?.focus()
  }, [status])

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
    const data = { ...Object.fromEntries(new FormData(e.currentTarget)), page: window.location.pathname, _subject: 'New quote request from myrakal.com' }
    setStatus('sending')
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, { method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      setStatus(res.ok ? 'success' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      onMouseDown={(e) => {
        pressedBackdrop.current = e.target === e.currentTarget
      }}
      onClick={(e) => {
        if (pressedBackdrop.current && e.target === e.currentTarget) onClose()
        pressedBackdrop.current = false
      }}
      onKeyDown={onKeyDown}
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-ink/85 p-4 sm:items-center"
    >
      <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="quote-title" tabIndex={-1} className="my-auto w-full max-w-lg border border-champagne/60 bg-charcoal p-6 font-caslon text-cream outline-none sm:p-8">
        <h2 id="quote-title" className="font-display text-3xl text-champagne italic">Send your quote</h2>
        {status === 'success' ? (
          <div className="mt-6">
            <p role="status">Thank you. We&apos;ll reply within 2 business days.</p>
            <button type="button" onClick={onClose} className={`${LABEL} mt-6 underline underline-offset-4`}>Close</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 flex flex-col gap-4">
            <label className="flex flex-col gap-1.5"><span className={LABEL}>Name</span><input ref={first} name="name" required autoComplete="name" className={FIELD} /></label>
            <label className="flex flex-col gap-1.5"><span className={LABEL}>Email</span><input name="email" type="email" required autoComplete="email" className={FIELD} /></label>
            <label className="flex flex-col gap-1.5"><span className={LABEL}>Phone (optional)</span><input name="phone" type="tel" autoComplete="tel" className={FIELD} /></label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL}>Treatment</span>
              <select name="treatment" required defaultValue="" className={FIELD}>
                <option value="" disabled>Choose one</option>
                {['Dental', 'Cosmetic', 'Something else'].map((t) => <option key={t}>{t}</option>)}
              </select>
            </label>
            <label className="flex flex-col gap-1.5"><span className={LABEL}>Your quote, or what you need</span><textarea name="message" required rows={4} placeholder="For example: $34,000 for All-on-4 on my upper jaw" className={`${FIELD} placeholder:text-mist/70`} /></label>
            <label className="flex flex-col gap-1.5">
              <span className={LABEL}>How did you hear about us? (optional)</span>
              <select name="source" defaultValue="" className={FIELD}>
                <option value="">Choose one</option>
                {SOURCES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </label>
            <div aria-hidden="true" className="sr-only"><input name="_gotcha" tabIndex={-1} autoComplete="off" defaultValue="" /></div>
            <p className="text-sm text-mist">Have a PDF or photo of your quote? We&apos;ll reply and you can send it then.</p>
            {status === 'error' && <p role="alert" className="text-sm text-cream">Something went wrong. Please try again, or email us at {CONTACT_EMAIL}.</p>}
            <div className="flex items-center justify-between gap-4">
              <button type="button" onClick={onClose} className={`${LABEL} underline underline-offset-4`}>Cancel</button>
              <button type="submit" disabled={status === 'sending'} className="border border-champagne/85 px-8 py-3 font-caslon text-xs tracking-[0.26em] text-champagne uppercase transition-colors hover:bg-champagne hover:text-charcoal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-champagne disabled:opacity-60">
                {status === 'sending' ? 'Sending...' : 'Send'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
