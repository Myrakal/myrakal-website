import type { PrismaClient } from '../generated/prisma/client.ts'

export class InvalidIntake extends Error {}

type Message = { role: 'assistant' | 'user'; text: string }

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CONTROL = /[\u0000-\u001f\u007f]/
const MAX_EMAIL = 254
const MAX_NAME = 200
const MAX_MESSAGES = 100
const MAX_TEXT = 4000
const MAX_TOTAL = 50000

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' && v !== null && !Array.isArray(v)

function parseName(value: unknown) {
  if (value === undefined || value === null) return null
  if (typeof value !== 'string' || value.includes('\u0000') || value.trim().length > MAX_NAME)
    throw new InvalidIntake('Invalid name')
  return value.trim() || null
}

function parseEmail(value: unknown) {
  const email = typeof value === 'string' ? value.trim().toLowerCase() : ''
  const domain = email.slice(email.indexOf('@') + 1)
  if (
    email.length > MAX_EMAIL ||
    !EMAIL.test(email) ||
    CONTROL.test(email) ||
    email.includes('..') ||
    domain.startsWith('.') ||
    domain.endsWith('.')
  )
    throw new InvalidIntake('Invalid email')
  return email
}

function parseTranscript(value: unknown): Message[] {
  if (!Array.isArray(value) || value.length < 1 || value.length > MAX_MESSAGES)
    throw new InvalidIntake('Invalid transcript')
  let total = 0
  return value.map((m) => {
    if (!isRecord(m) || (m.role !== 'assistant' && m.role !== 'user')) throw new InvalidIntake('Invalid message')
    const text = typeof m.text === 'string' ? m.text.trim() : ''
    if (text.length < 1 || text.length > MAX_TEXT || text.includes('\u0000'))
      throw new InvalidIntake('Invalid message text')
    total += text.length
    if (total > MAX_TOTAL) throw new InvalidIntake('Transcript too long')
    return { role: m.role, text }
  })
}

export async function saveIntake(input: unknown, store: Pick<PrismaClient, 'intake'>) {
  if (!isRecord(input)) throw new InvalidIntake('Invalid request')
  if (typeof input.website === 'string' && input.website.length > 0) return { id: 'ok' }
  const data = {
    name: parseName(input.name),
    email: parseEmail(input.email),
    transcript: parseTranscript(input.transcript),
  }
  return store.intake.create({ data, select: { id: true } })
}
