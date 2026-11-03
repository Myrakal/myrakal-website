'use client'

import { useEffect, useState } from 'react'

type Attachment = { name: string; path: string; size: number; createdAt: string; url: string | null }
type State = { phase: 'loading' } | { phase: 'error' } | { phase: 'ready'; items: Attachment[] }

const formatSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const formatDate = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function AttachmentsCard({ chatId, version }: { chatId: string; version: number }) {
  const [state, setState] = useState<State>({ phase: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    fetch(`/api/chats/${chatId}/attachments`, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) throw new Error()
        const items = await res.json()
        if (!Array.isArray(items)) throw new Error()
        setState({ phase: 'ready', items })
      })
      .catch(() => {
        if (!controller.signal.aborted) setState({ phase: 'error' })
      })
    return () => controller.abort()
  }, [chatId, version])

  return (
    <section aria-label="Your documents" className="border border-rule bg-velvet-deep/50 px-5 py-5 sm:px-7">
      <h2 className="font-display text-2xl text-cream italic">Your documents</h2>
      {state.phase === 'loading' && <p role="status" className="mt-4 text-sm text-mist">Loading…</p>}
      {state.phase === 'error' && <p role="alert" className="mt-4 text-sm text-destructive">We could not load your documents.</p>}
      {state.phase === 'ready' && state.items.length === 0 && <p className="mt-4 text-sm text-mist">No documents yet</p>}
      {state.phase === 'ready' && state.items.length > 0 && (
        <ul className="mt-3 divide-y divide-rule text-sm text-cream">
          {state.items.map((item) => (
            <li key={item.path} className="flex items-center justify-between gap-4 py-2">
              <div className="min-w-0">
                <p className="truncate">{item.name}</p>
                <p className="text-xs text-mist">{formatSize(item.size)} · {formatDate(item.createdAt)}</p>
              </div>
              {item.url && (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="shrink-0 font-caslon text-xs tracking-[0.26em] text-champagne uppercase underline-offset-4 hover:underline">
                  View
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
