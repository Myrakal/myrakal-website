'use client'

import { type ReactNode, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { ContactModal } from '@/components/ContactModal'

export function TalkWithUs({ className, children }: { className: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  const trigger = useRef<HTMLButtonElement>(null)

  const close = () => {
    setOpen(false)
    trigger.current?.focus()
  }

  return (
    <>
      <button ref={trigger} type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className={className}>
        {children}
      </button>
      {open && createPortal(<ContactModal onClose={close} />, document.body)}
    </>
  )
}
