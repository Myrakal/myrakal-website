import type { Message } from '@/components/chat/ChatMessage'

const TIMEOUT_MS = 6_000
const MAX_MESSAGES = 20

let unavailable = false

const redact = (text: string) => text.replace(/[^\s@]+@[^\s@]*[^\s@.,;:!?)'"\]]/g, '[email]')

export async function acknowledge(messages: Message[], signal?: AbortSignal) {
  if (unavailable || signal?.aborted) return ''
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const onAbort = () => controller.abort()
  signal?.addEventListener('abort', onAbort)
  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages: messages.slice(-MAX_MESSAGES).map(({ role, text }) => ({ role, text: redact(text) })),
      }),
      signal: controller.signal,
    })
    if (res.status === 503) unavailable = true
    if (!res.ok) return ''
    const { reply } = await res.json()
    return typeof reply === 'string' ? reply.trim() : ''
  } catch {
    return ''
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', onAbort)
  }
}
