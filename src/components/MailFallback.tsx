'use client'

import { useEffect, useState } from 'react'

const DEFAULT_ADDRESS = 'eshaansood@myrakal.com'
const linkClass = 'underline underline-offset-4 hover:decoration-2'

type Props = { subject: string; address?: string; body?: string; hideAddress?: boolean }

export function MailFallback({ subject, address = DEFAULT_ADDRESS, body, hideAddress = false }: Props) {
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [message])

  const to = encodeURIComponent(address)
  const su = encodeURIComponent(subject)
  const text = body === undefined ? '' : `&body=${encodeURIComponent(body)}`

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setMessage('Copied')
    } catch {
      setMessage('Could not copy. Please copy it manually.')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      {!hideAddress && <span className="select-all">{address}</span>}
      <button type="button" onClick={copy} className={linkClass}>
        Copy address
      </button>
      <a
        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Open in Gmail
      </a>
      <a
        href={`https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}${text}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Open in Outlook
      </a>
      <span role="status" className="basis-full empty:hidden">
        {message}
      </span>
    </div>
  )
}
