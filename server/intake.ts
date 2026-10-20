import type { PrismaClient } from '../generated/prisma/client.ts'

export class InvalidIntake extends Error {}

type Message = { role: 'assistant' | 'user'; text: string }

const MAX = { email: 254, name: 200, messages: 100, text: 4000, total: 50000 }
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LONE_SURROGATE = /[\ud800-\udbff](?![\udc00-\udfff])|(?<![\ud800-\udbff])[\udc00-\udfff]/
const STRICT_CONTROL = /[\u0000-\u001f\u007f-\u009f]/
const TEXT_CONTROL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f-\u009f]/
const STRICT_FORMAT = /[\p{Cf}\p{Zl}\p{Zp}]/u
const TEXT_FORMAT = /(?![\u200c\u200d])\p{Cf}|[\p{Zl}\p{Zp}]/u

const unsafe = (value: string, control: RegExp, format: RegExp) =>
  control.test(value) || format.test(value) || LONE_SURROGATE.test(value)
export const unsafeText = (value: string) => unsafe(value, TEXT_CONTROL, TEXT_FORMAT)
const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

function parseName(value: unknown) {
  if (value === undefined || value === null) return null
  if (typeof value !== 'string' || unsafe(value, STRICT_CONTROL, TEXT_FORMAT) || value.trim().length > MAX.name)
    throw new InvalidIntake('Invalid name')
  return value.trim() || null
}

function parseEmail(value: unknown) {
  const raw = typeof value === 'string' ? value : ''
  const email = raw.trim().toLowerCase()
  const at = email.indexOf('@')
  const local = email.slice(0, at)
  if (
    email.length > MAX.email ||
    !EMAIL.test(email) ||
    unsafe(raw, STRICT_CONTROL, STRICT_FORMAT) ||
    email.includes('..') ||
    local.length > 64 ||
    /^\.|\.$/.test(local) ||
    email.slice(at + 1).split('.').some((label) => !label || label.startsWith('-') || label.endsWith('-'))
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
    const raw = typeof m.text === 'string' ? m.text : ''
    const text = raw.trim()
    if (text.length < 1 || text.length > MAX.text || unsafe(raw, TEXT_CONTROL, TEXT_FORMAT))
      throw new InvalidIntake('Invalid message text')
    total += text.length
    if (total > MAX.total) throw new InvalidIntake('Transcript too long')
    return { role: m.role, text }
  })
}

export async function saveIntake(input: unknown, store: Pick<PrismaClient, 'intake'>) {
  if (!isRecord(input)) throw new InvalidIntake('Invalid request')
  if (typeof input.website === 'string' && input.website.length > 0) return { id: crypto.randomUUID() }
  return store.intake.create({
    data: { name: parseName(input.name), email: parseEmail(input.email), transcript: parseTranscript(input.transcript) },
    select: { id: true },
  })
}
