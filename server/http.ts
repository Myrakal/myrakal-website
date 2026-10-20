export const json = (body: unknown, status: number, headers?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })

export const methodNotAllowed = () => json({ error: 'Method not allowed' }, 405, { allow: 'POST' })

const tooLarge = () => json({ error: 'Request too large' }, 413)

function sameHost(request: Request, origin: string) {
  const forwarded = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const expected = forwarded || request.headers.get('host') || new URL(request.url).host
  return URL.canParse(origin) && new URL(origin).host === expected
}

async function readLimited(request: Request, max: number) {
  const reader = request.body?.getReader()
  if (!reader) return ''
  const decoder = new TextDecoder('utf-8', { fatal: true })
  let total = 0
  let text = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) return text + decoder.decode()
    total += value.byteLength
    if (total > max) return reader.cancel().then(() => null)
    text += decoder.decode(value, { stream: true })
  }
}

export function logFailure(label: string, err: unknown) {
  const name = err instanceof Error ? err.name : 'UnknownError'
  const { code, status } = (err ?? {}) as { code?: unknown; status?: unknown }
  console.error(label, name, typeof code === 'string' ? code : typeof status === 'number' ? status : undefined)
}

export function checkRequest(request: Request, max: number) {
  const origin = request.headers.get('origin')
  if (origin && !sameHost(request, origin)) return json({ error: 'Forbidden' }, 403)
  if (!(request.headers.get('content-type') ?? '').toLowerCase().startsWith('application/json'))
    return json({ error: 'Content-Type must be application/json' }, 415)
  if (Number(request.headers.get('content-length')) > max) return tooLarge()
  return null
}

export async function readJsonBody(
  request: Request,
  max: number,
  label: string,
): Promise<{ response: Response } | { value: unknown }> {
  try {
    const text = await readLimited(request, max)
    if (text === null) return { response: tooLarge() }
    return { value: JSON.parse(text) as unknown }
  } catch (err) {
    if (err instanceof SyntaxError) return { response: json({ error: 'Invalid JSON' }, 400) }
    logFailure(`${label} body read failed`, err)
    return { response: json({ error: 'Invalid request body' }, 400) }
  }
}
