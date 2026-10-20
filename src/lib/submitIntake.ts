import type { Message } from '@/components/chat/ChatMessage'

type IntakeBody = { name?: string; email: string; transcript: Message[] }

export async function submitIntake({ name, email, transcript }: IntakeBody) {
  const res = await fetch('/api/intake', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, transcript: transcript.map(({ role, text }) => ({ role, text })) }),
  })
  if (!res.ok) throw new Error(`Intake request failed: ${res.status}`)
  return (await res.json()) as { id: string }
}
