import { unsafeText } from './intake.ts'

export class InvalidChat extends Error {}

const MAX = { messages: 20, text: 4000 }

export function latestUserText(input: unknown) {
  const raw = typeof input === 'object' && input !== null ? (input as { messages?: unknown }).messages : undefined
  const last = Array.isArray(raw) ? raw.at(-1) : undefined
  if (typeof last !== 'object' || last === null) return null
  const { role, text } = last as Record<string, unknown>
  return role === 'user' && typeof text === 'string' ? text : null
}

export function parseLatestMessage(input: unknown) {
  const raw = typeof input === 'object' && input !== null ? (input as { messages?: unknown }).messages : undefined
  if (!Array.isArray(raw) || raw.length < 1 || raw.length > MAX.messages) throw new InvalidChat('Invalid messages')
  const { role, text } = (typeof raw.at(-1) === 'object' && raw.at(-1) !== null ? raw.at(-1) : {}) as Record<string, unknown>
  if (role !== 'user' || typeof text !== 'string' || !text.trim() || text.length > MAX.text || unsafeText(text))
    throw new InvalidChat('Invalid messages')
  return text
}
