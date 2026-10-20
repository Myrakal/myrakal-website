import { db } from '../server/db.ts'
import { InvalidIntake, saveIntake } from '../server/intake.ts'

const MAX_BYTES = 100000

const json = (body: unknown, status: number, headers?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })

const methodNotAllowed = () => json({ error: 'Method not allowed' }, 405, { allow: 'POST' })

export { methodNotAllowed as DELETE, methodNotAllowed as GET, methodNotAllowed as PATCH, methodNotAllowed as PUT }

const tooLarge = () => json({ error: 'Request too large' }, 413)

function sameHost(request: Request, origin: string) {
  const forwarded = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const expected = forwarded || request.headers.get('host') || new URL(request.url).host
  return URL.canParse(origin) && new URL(origin).host === expected
}

async function readLimited(request: Request) {
  const reader = request.body?.getReader()
  if (!reader) return ''
  const decoder = new TextDecoder()
  let total = 0
  let text = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) return text + decoder.decode()
    total += value.byteLength
    if (total > MAX_BYTES) return reader.cancel().then(() => null)
    text += decoder.decode(value, { stream: true })
  }
}

function logFailure(err: unknown) {
  const name = err instanceof Error ? err.name : 'UnknownError'
  const code = typeof (err as { code?: unknown })?.code === 'string' ? (err as { code: string }).code : undefined
  console.error('intake save failed', name, code)
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && !sameHost(request, origin)) return json({ error: 'Forbidden' }, 403)
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json'))
    return json({ error: 'Content-Type must be application/json' }, 415)
  if (Number(request.headers.get('content-length')) > MAX_BYTES) return tooLarge()

  const text = await readLimited(request)
  if (text === null) return tooLarge()
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
