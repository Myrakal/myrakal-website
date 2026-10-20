import { ArrowUp } from 'lucide-react'
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'

import { Button } from '@/components/ui/button'

type Props = { onSend: (text: string) => void; busy?: boolean; locked?: boolean }

export function ChatComposer({ onSend, busy = false, locked = false }: Props) {
  const [text, setText] = useState('')
  const id = useId()
  const box = useRef<HTMLTextAreaElement>(null)
  const canSend = text.trim().length > 0 && !busy && !locked

  useEffect(() => {
    if (!locked) return
    setText('')
    if (box.current) box.current.style.height = ''
  }, [locked])

  const send = () => {
    if (!canSend) return
    onSend(text.trim())
    setText('')
    if (box.current) box.current.style.height = ''
    box.current?.focus()
  }

  const grow = (el: HTMLTextAreaElement) => {
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex items-end gap-2 rounded-3xl border border-border bg-card p-2 shadow-sm focus-within:ring-2 focus-within:ring-foreground/40">
      <label className="sr-only" htmlFor={id}>
        Message
      </label>
      <textarea
        maxLength={4000}
        id={id}
        ref={box}
        rows={1}
        value={locked ? '' : text}
        onChange={(e) => {
          setText(e.target.value)
          grow(e.target)
        }}
        onKeyDown={onKeyDown}
        placeholder="Type your message"
        readOnly={locked}
        aria-readonly={locked}
        className="max-h-40 min-h-12 flex-1 resize-none bg-transparent px-4 py-3 text-base text-card-foreground placeholder:text-card-foreground/60 focus:outline-none"
      />
      <Button
        type="button"
        size="icon-lg"
        aria-label="Send message"
        disabled={!canSend}
        onClick={send}
        className="size-12 shrink-0 cursor-pointer disabled:bg-muted disabled:bg-none disabled:text-muted-foreground disabled:opacity-100"
      >
        <ArrowUp className="size-5" aria-hidden="true" />
      </Button>
    </div>
  )
}
