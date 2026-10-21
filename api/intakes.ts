import { createHash, timingSafeEqual } from 'node:crypto'
import { db } from '../server/db.ts'

const json = (body: unknown, status: number, headers?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })

function authorized(request: Request) {
  const expected = process.env.DOCTOR_TOKEN
  const given = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1]
  if (!expected || !given) return false
  const digest = (v: string) => createHash('sha256').update(v).digest()
  return timingSafeEqual(digest(given), digest(expected))
}

export async function GET(request: Request) {
  if (!authorized(request)) return json({ error: 'Unauthorized' }, 401)
  try {
    const intakes = await db().intake.findMany({ select: { id: true, createdAt: true, name: true, email: true, transcript: true, consultStatus: true, paidAt: true, consultNote: true, reviewedAt: true }, orderBy: { createdAt: 'desc' }, take: 200 })
    return json(intakes, 200)
  } catch (err) {
    console.error('intake list failed', err instanceof Error ? err.name : 'UnknownError')
    return json({ error: 'Could not load intakes' }, 500)
  }
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const DECISIONS = ['approved', 'changes_requested']
const NOTE_MAX = 4000

export async function POST(request: Request) {
  if (!authorized(request)) return json({ error: 'Unauthorized' }, 401)
  const body = await request.json().catch(() => null)
  const { id, decision, note } = body ?? {}
  if (typeof id !== 'string' || !UUID.test(id)) return json({ error: 'Invalid id' }, 400)
  if (!DECISIONS.includes(decision)) return json({ error: 'Invalid decision' }, 400)
  if (note !== undefined && note !== null && typeof note !== 'string') return json({ error: 'Invalid note' }, 400)
  const text = (note ?? '').trim()
  if (text.length > NOTE_MAX || (decision === 'changes_requested' && !text)) return json({ error: 'Invalid note' }, 400)
  try {
    const reviewedAt = new Date()
    const consultNote = text || null
    const { count } = await db().intake.updateMany({
      where: { id, consultStatus: 'in_review' },
      data: { consultStatus: decision, consultNote, reviewedAt },
    })
    if (count) return json({ id, consultStatus: decision, consultNote, reviewedAt }, 200)
    const exists = await db().intake.findUnique({ where: { id }, select: { id: true } })
    return exists ? json({ error: 'Not in review' }, 409) : json({ error: 'Not found' }, 404)
  } catch (err) {
    console.error('intake decision failed', err instanceof Error ? err.name : 'UnknownError')
    return json({ error: 'Could not save decision' }, 500)
  }
}

const methodNotAllowed = () => json({ error: 'Method not allowed' }, 405, { allow: 'GET, POST' })
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed
