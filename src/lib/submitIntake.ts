import type { Message } from '@/components/chat/ChatMessage'

type IntakeBody = { name?: string; email: string; transcript: Message[] }

const TIMEOUT_MS = 10_000

export async function submitIntake({ name, email, transcript }: IntakeBody, signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError')
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const onAbort = () => controller.abort()
  signal?.addEventListener('abort', onAbort)
  try {
    const res = await fetch('/api/intake', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, transcript: transcript.map(({ role, text, record }) => ({ role, text: record ?? text })) }),
      signal: controller.signal,
    })
    if (!res.ok) throw new Error(`Intake request failed: ${res.status}`)
    let id: string | undefined
    try {
      id = (await res.json()).id
    } catch {
      id = undefined
    }
    return { id }
  } finally {
    clearTimeout(timeout)
    signal?.removeEventListener('abort', onAbort)
  }
}
