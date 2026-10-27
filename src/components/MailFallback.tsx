'use client'

import { useEffect, useState } from 'react'

const ADDRESS = 'eshaansood@myrakal.com'
const linkClass = 'underline underline-offset-4 hover:decoration-2'

export function MailFallback({ subject }: { subject: string }) {
  const [message, setMessage] = useState('')
  useEffect(() => {
    if (!message) return
    const timer = setTimeout(() => setMessage(''), 3000)
    return () => clearTimeout(timer)
  }, [message])

  const to = encodeURIComponent(ADDRESS)
  const su = encodeURIComponent(subject)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS)
      setMessage('Copied')
    } catch {
      setMessage('Could not copy. Please copy it manually.')
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
      <span className="select-all">{ADDRESS}</span>
      <button type="button" onClick={copy} className={linkClass}>
        Copy address
      </button>
      <a
        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${su}`}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
      >
        Open in Gmail
      </a>
      <a
        href={`https://outlook.live.com/mail/0/deeplink/compose?to=${to}&subject=${su}`}
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
