import type { PrismaClient } from '../generated/prisma/client.ts'

export class InvalidIntake extends Error {}

type Message = { role: 'assistant' | 'user'; text: string }

const MAX = { email: 254, name: 200, messages: 100, text: 4000, total: 50000 }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LONE_SURROGATE = /[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/
const BIDI = /[\u202a-\u202e\u2066-\u2069]/
const STRICT_CONTROL = /[\u0000-\u001f\u007f-\u009f]/
const TEXT_CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/

const unsafe = (value: string, control: RegExp) =>
  control.test(value) || BIDI.test(value) || LONE_SURROGATE.test(value)

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

function parseName(value: unknown) {
  if (value === undefined || value === null) return null
  if (typeof value !== 'string' || unsafe(value, STRICT_CONTROL) || value.trim().length > MAX.name)
    throw new InvalidIntake('Invalid name')
  return value.trim() || null
}

function parseEmail(value: unknown) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : ''
  const domain = email.slice(email.indexOf('@') + 1)
  if (
    email.length > MAX.email ||
    !EMAIL.test(email) ||
    unsafe(email, STRICT_CONTROL) ||
    email.includes('..') ||
    domain.startsWith('.') ||
    domain.endsWith('.')
  )
    throw new InvalidIntake('Invalid email')
  return email
}

function parseTranscript(value: unknown): Message[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX.messages)
    throw new InvalidIntake('Invalid transcript')
  let total = 0
  return value.map((m) => {
    if (!isRecord(m) || (m.role !== 'assistant' && m.role !== 'user')) throw new InvalidIntake('Invalid message')
    const text = typeof m.text === 'string' ? m.text.trim() : ''
    if (text.length < 1 || text.length > MAX.text || unsafe(text, TEXT_CONTROL))
      throw new InvalidIntake('Invalid message text')
    total += text.length
    if (total > MAX.total) throw new InvalidIntake('Transcript too long')
    return { role: m.role, text }
  })
}

export async function saveIntake(input: unknown, store: Pick<PrismaClient, 'intake'>) {
  if (!isRecord(input)) throw new InvalidIntake('Invalid request')
  if (typeof input.website === 'string' && input.website.length > 0) return { id: crypto.randomUUID() }
  const data = {
    name: parseName(input.name),
    email: parseEmail(input.email),
    transcript: parseTranscript(input.transcript),
  }
  return store.intake.create({ data, select: { id: true } })
}
