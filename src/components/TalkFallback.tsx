'use client'

import { useEffect, useRef, useState } from 'react'
import { GMAIL_HREF, OUTLOOK_HREF, TALK_EMAIL } from '@/lib/contact'

const control =
  'underline-offset-4 hover:text-cream hover:underline focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-champagne'

export function TalkFallback() {
  const [message, setMessage] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const show = (text: string) => {
    clearTimeout(timer.current)
    setMessage(text)
    timer.current = setTimeout(() => setMessage(''), 2000)
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(TALK_EMAIL)
      show('Copied')
    } catch {
      show('Copy failed. Select the address instead')
    }
  }

  return (
    <div className="space-y-2 text-sm">
      <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-cream select-all">{TALK_EMAIL}</span>
        <button type="button" onClick={copy} className={control}>
          Copy address
        </button>
        <span role="status" className="text-champagne empty:hidden">
          {message}
        </span>
      </p>
      <p className="flex flex-wrap gap-x-4 gap-y-1 text-xs tracking-[0.2em] uppercase">
        <a href={GMAIL_HREF} target="_blank" rel="noopener noreferrer" className={control}>
          Open in Gmail<span className="sr-only"> (new tab)</span>
        </a>
        <a href={OUTLOOK_HREF} target="_blank" rel="noopener noreferrer" className={control}>
          Open in Outlook<span className="sr-only"> (new tab)</span>
        </a>
      </p>
    </div>
  )
}
