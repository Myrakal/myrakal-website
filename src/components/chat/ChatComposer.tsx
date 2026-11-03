'use client'

import { ArrowUp } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

import { Button } from '@/components/ui/button'

type Props = { onSend: (text: string) => void | boolean | Promise<boolean | void>; busy?: boolean }

export function ChatComposer({ onSend, busy = false }: Props) {
  const [text, setText] = useState('')
  const id = useId()
  const box = useRef<HTMLTextAreaElement>(null)
  const canSend = text.trim().length > 0 && !busy

  const send = async () => {
    if (!canSend) return
    const message = text.trim()
    setText('')
    box.current?.focus()
    if ((await onSend(message)) === false) setText((current) => current || message)
  }

  useEffect(() => {
    const el = box.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [text])

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex items-end gap-2 border border-rule bg-velvet-deep/40 p-2 transition-colors focus-within:border-champagne/85">
      <label className="sr-only" htmlFor={id}>
        Message
      </label>
      <textarea
        id={id}
        ref={box}
        rows={1}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Type your message"
        className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-4 py-3 text-base text-cream placeholder:text-mist focus:outline-none"
      />
      <Button
        type="button"
        size="icon-lg"
        aria-label="Send message"
        disabled={!canSend}
        onClick={send}
        className="size-12 shrink-0 cursor-pointer rounded-none! border border-champagne/85 bg-transparent text-champagne hover:bg-champagne hover:text-ink disabled:border-mist/40 disabled:bg-transparent disabled:text-mist disabled:opacity-100"
      >
        <ArrowUp className="size-5" aria-hidden="true" />
      </Button>
    </div>
  )
}
