import type { Message } from '@/components/chat/ChatMessage'

const MAX = 60

export function caseTitle(messages: Message[]) {
  const text = messages.find((m) => m.role === 'user')?.text.trim()
  if (!text) return 'Your case'
  return text.length > MAX ? `${text.slice(0, MAX).trimEnd()}…` : text
}
