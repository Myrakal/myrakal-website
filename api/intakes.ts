import { timingSafeEqual } from 'node:crypto'
import { db } from '../server/db.ts'

const json = (body: unknown, status: number, headers?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', 'cache-control': 'no-store', ...headers },
  })

function authorized(request: Request) {
  const expected = process.env.DOCTOR_TOKEN
  const given = request.headers.get('authorization')?.replace(/^Bearer /, '') ?? ''
  if (!expected || !given) return false
  const [a, b] = [Buffer.from(given), Buffer.from(expected)]
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function GET(request: Request) {
  if (!authorized(request)) return json({ error: 'Unauthorized' }, 401)
  try {
    const intakes = await db().intake.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
    return json(intakes, 200)
  } catch (err) {
    console.error('intake list failed', err instanceof Error ? err.name : 'UnknownError')
    return json({ error: 'Could not load intakes' }, 500)
  }
}

export const POST = () => json({ error: 'Method not allowed' }, 405, { allow: 'GET' })
