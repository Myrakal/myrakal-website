import { unsafeText } from './intake.ts'

export class InvalidChat extends Error {}

export type ChatMessage = { role: 'assistant' | 'user'; text: string }

const MAX = { messages: 20, text: 4000 }

function parseMessage(value: unknown): ChatMessage {
  const { role, text } = (typeof value === 'object' && value !== null ? value : {}) as Record<string, unknown>
  if (
    (role !== 'assistant' && role !== 'user') ||
    typeof text !== 'string' ||
    !text.trim() ||
    text.length > MAX.text ||
    unsafeText(text)
  )
    throw new InvalidChat('Invalid messages')
  return { role, text }
}

export function parseMessages(input: unknown) {
  const raw = (typeof input === 'object' && input !== null ? (input as { messages?: unknown }).messages : undefined)
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > MAX.messages) throw new InvalidChat('Invalid messages')
  const messages = raw.map(parseMessage)
  if (messages[messages.length - 1].role !== 'user') throw new InvalidChat('Invalid messages')
  return messages
}
