import { db } from '../server/db.ts'
import { InvalidIntake, saveIntake } from '../server/intake.ts'

const MAX_BYTES = 100000

const json = (body: unknown, status: number, headers?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })

const methodNotAllowed = () => json({ error: 'Method not allowed' }, 405, { allow: 'POST' })

export const GET = methodNotAllowed
export const PUT = methodNotAllowed
export const PATCH = methodNotAllowed
export const DELETE = methodNotAllowed

const tooLarge = () => json({ error: 'Request too large' }, 413)

function logFailure(err: unknown) {
  const name = err instanceof Error ? err.name : 'UnknownError'
  const code = typeof (err as { code?: unknown })?.code === 'string' ? (err as { code: string }).code : undefined
  console.error('intake save failed', name, code)
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) return json({ error: 'Forbidden' }, 403)
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json'))
    return json({ error: 'Content-Type must be application/json' }, 415)
  if (Number(request.headers.get('content-length')) > MAX_BYTES) return tooLarge()

  const text = await request.text()
  if (new TextEncoder().encode(text).length > MAX_BYTES) return tooLarge()
  let input: unknown
  try {
    input = JSON.parse(text)
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }
  try {
    const { id } = await saveIntake(input, db())
    return json({ id }, 201)
  } catch (err) {
    if (err instanceof InvalidIntake) return json({ error: err.message }, 400)
    logFailure(err)
    return json({ error: 'Could not save intake' }, 500)
  }
}
