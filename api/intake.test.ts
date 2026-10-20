import { vi } from 'vitest'

const create = vi.fn()
vi.mock('../server/db.ts', () => ({ db: () => ({ intake: { create } }) }))

import { DELETE, GET, PATCH, POST, PUT } from './intake'

const body = {
  email: 'ada@example.com',
  transcript: [{ role: 'user', text: 'Knee pain' }],
}

const post = (payload: unknown, raw = false, headers: Record<string, string> = {}) =>
  POST(
    new Request('http://localhost/api/intake', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: raw ? (payload as string) : JSON.stringify(payload),
    }),
  )

describe('POST /api/intake', () => {
  beforeEach(() => {
    create.mockReset()
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('returns 201 with the new id', async () => {
    create.mockResolvedValue({ id: 'abc-123' })
    const res = await post(body)
    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({ id: 'abc-123' })
  })

  it('returns 201 without saving when the honeypot is filled', async () => {
    const res = await post({ ...body, website: 'http://spam.example' })
    expect(res.status).toBe(201)
    expect((await res.json()).id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
    expect(create).not.toHaveBeenCalled()
  })

  it('returns 400 with an error for invalid input', async () => {
    const res = await post({ ...body, email: 'nope' })
    expect(res.status).toBe(400)
    expect(typeof (await res.json()).error).toBe('string')
    expect(create).not.toHaveBeenCalled()
  })

  it('returns 400 for malformed JSON', async () => {
    const res = await post('{not json', true)
    expect(res.status).toBe(400)
  })

  it('returns 500 with a generic message and no internals when the database fails', async () => {
    create.mockRejectedValue(new Error('connection to db.secret.supabase.co refused'))
    const res = await post(body)
    expect(res.status).toBe(500)
    const text = await res.text()
    expect(JSON.parse(text)).toEqual({ error: 'Could not save intake' })
    expect(text).not.toMatch(/secret|supabase|refused/)
  })

  it('returns JSON content type', async () => {
    create.mockResolvedValue({ id: 'x' })
    expect((await post(body)).headers.get('content-type')).toMatch(/application\/json/)
  })
})

describe('POST /api/intake request hardening', () => {
  beforeEach(() => {
    create.mockReset()
    create.mockResolvedValue({ id: 'abc-123' })
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it.each(['text/plain', 'application/x-www-form-urlencoded', ''])('returns 415 for content type "%s"', async (type) => {
    const res = await post(JSON.stringify(body), true, { 'content-type': type })
    expect(res.status).toBe(415)
    expect(typeof (await res.json()).error).toBe('string')
    expect(create).not.toHaveBeenCalled()
  })

  it('accepts application/json with a charset', async () => {
    const res = await post(body, false, { 'content-type': 'application/json; charset=utf-8' })
    expect(res.status).toBe(201)
  })

  it('returns 413 when content-length is over 262144 bytes, before parsing', async () => {
    const res = await post('{not json', true, { 'content-length': '262145' })
    expect(res.status).toBe(413)
    expect(create).not.toHaveBeenCalled()
  })

  it('returns 413 when the actual body is over 262144 bytes and no content-length is sent', async () => {
    const res = await post(`{"pad":"${'x'.repeat(262145)}"}`, true)
    expect(res.status).toBe(413)
    expect(create).not.toHaveBeenCalled()
  })

  it('counts bytes, not characters, against the limit', async () => {
    const res = await post(`{"pad":"${'é'.repeat(131073)}"}`, true)
    expect(res.status).toBe(413)
  })

  it('allows a same-origin Origin header', async () => {
    expect((await post(body, false, { origin: 'http://localhost' })).status).toBe(201)
  })

  it('returns 403 for a cross-origin Origin header', async () => {
    const res = await post(body, false, { origin: 'https://evil.example' })
    expect(res.status).toBe(403)
    expect(typeof (await res.json()).error).toBe('string')
    expect(create).not.toHaveBeenCalled()
  })

  it('allows requests with no Origin header', async () => {
    expect((await post(body)).status).toBe(201)
  })

  it('logs only the error name and code, never the message', async () => {
    const err = Object.assign(new Error('connection to db.secret.supabase.co refused'), {
      name: 'PrismaClientKnownRequestError',
      code: 'P2002',
    })
    create.mockRejectedValue(err)
    await post(body)
    const logged = JSON.stringify(vi.mocked(console.error).mock.calls)
    expect(logged).toMatch(/PrismaClientKnownRequestError/)
    expect(logged).toMatch(/P2002/)
    expect(logged).not.toMatch(/secret|supabase|refused/)
    expect(vi.mocked(console.error).mock.calls.flat().some((a) => a instanceof Error)).toBe(false)
  })

  it('logs just the name when the error has no code', async () => {
    create.mockRejectedValue(new TypeError('secret detail'))
    await post(body)
    const logged = JSON.stringify(vi.mocked(console.error).mock.calls)
    expect(logged).toMatch(/TypeError/)
    expect(logged).not.toMatch(/secret detail/)
    expect(vi.mocked(console.error).mock.calls.flat().some((a) => a instanceof Error)).toBe(false)
  })

  it('does not call the database and returns 201 for a filled honeypot', async () => {
    const res = await post({ ...body, website: 'x' })
    expect(res.status).toBe(201)
    expect(create).not.toHaveBeenCalled()
  })
})

const postTo = (url: string, headers: Record<string, string>) =>
  POST(
    new Request(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify(body),
    }),
  )

describe('POST /api/intake origin check behind proxies', () => {
  beforeEach(() => {
    create.mockReset()
    create.mockResolvedValue({ id: 'abc-123' })
  })

  it('compares Origin to x-forwarded-host when present', async () => {
    const ok = await postTo('http://internal.local/api/intake', {
      origin: 'https://myrakal.com',
      'x-forwarded-host': 'myrakal.com',
    })
    expect(ok.status).toBe(201)
  })

  it('rejects an Origin that matches the URL host but not x-forwarded-host', async () => {
    const res = await postTo('http://internal.local/api/intake', {
      origin: 'http://internal.local',
      'x-forwarded-host': 'myrakal.com',
    })
    expect(res.status).toBe(403)
  })

  it('uses the first value of a comma-separated x-forwarded-host', async () => {
    const res = await postTo('http://internal.local/api/intake', {
      origin: 'https://myrakal.com',
      'x-forwarded-host': 'myrakal.com, proxy.internal',
    })
    expect(res.status).toBe(201)
  })

  it('compares Origin to the host header when there is no x-forwarded-host', async () => {
    const ok = await postTo('http://internal.local/api/intake', {
      origin: 'https://myrakal.com',
      host: 'myrakal.com',
    })
    expect(ok.status).toBe(201)
    const bad = await postTo('http://internal.local/api/intake', {
      origin: 'http://internal.local',
      host: 'myrakal.com',
    })
    expect(bad.status).toBe(403)
  })

  it('falls back to the request URL host and ignores the scheme', async () => {
    const ok = await postTo('http://myrakal.com/api/intake', { origin: 'https://myrakal.com' })
    expect(ok.status).toBe(201)
    const bad = await postTo('http://myrakal.com/api/intake', { origin: 'https://other.com' })
    expect(bad.status).toBe(403)
  })

  it('compares ports as part of the host', async () => {
    const res = await postTo('http://localhost:5173/api/intake', { origin: 'http://localhost:3000' })
    expect(res.status).toBe(403)
  })

  it('rejects an unparseable Origin', async () => {
    const res = await postTo('http://localhost/api/intake', { origin: 'null' })
    expect(res.status).toBe(403)
  })
})

describe('POST /api/intake streaming body limit', () => {
  beforeEach(() => {
    create.mockReset()
    create.mockResolvedValue({ id: 'abc-123' })
  })

  const streamed = (chunks: string[], onPull?: () => void) => {
    const encoder = new TextEncoder()
    let i = 0
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        onPull?.()
        if (i >= chunks.length) controller.close()
        else controller.enqueue(encoder.encode(chunks[i++]))
      },
    })
    return new Request('http://localhost/api/intake', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: stream,
      duplex: 'half',
    } as RequestInit)
  }

  it('stops reading and returns 413 as soon as the running total exceeds the limit', async () => {
    let pulls = 0
    const chunks = Array.from({ length: 100 }, () => 'x'.repeat(10000))
    const res = await POST(streamed(chunks, () => pulls++))
    expect(res.status).toBe(413)
    expect(pulls).toBeLessThan(40)
    expect(create).not.toHaveBeenCalled()
  })

  it('accepts a maximal valid transcript of three-byte characters', async () => {
    const full = { role: 'user', text: '€'.repeat(4000) }
    const transcript = [...Array.from({ length: 12 }, () => full), { role: 'user', text: '€'.repeat(2000) }]
    const res = await post({ ...body, transcript })
    expect(res.status).toBe(201)
    expect(create).toHaveBeenCalledTimes(1)
  })

  it('accepts a body streamed in several chunks under the limit', async () => {
    const json = JSON.stringify(body)
    const res = await POST(streamed([json.slice(0, 10), json.slice(10)]))
    expect(res.status).toBe(201)
  })

  it('decodes multi-byte characters split across chunks', async () => {
    const payload = JSON.stringify({ ...body, name: 'José' })
    const bytes = new TextEncoder().encode(payload)
    const split = new TextEncoder().encode(payload.slice(0, payload.indexOf('é'))).length + 1
    const req = new Request('http://localhost/api/intake', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: new ReadableStream<Uint8Array>({
        start(controller) {
          controller.enqueue(bytes.slice(0, split))
          controller.enqueue(bytes.slice(split))
          controller.close()
        },
      }),
      duplex: 'half',
    } as RequestInit)
    const res = await POST(req)
    expect(res.status).toBe(201)
    expect(create.mock.calls[0][0].data.name).toBe('José')
  })
})

describe('POST /api/intake body read failures and encoding', () => {
  beforeEach(() => {
    create.mockReset()
    create.mockResolvedValue({ id: 'abc-123' })
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  const withBody = (body: BodyInit) =>
    new Request('http://localhost/api/intake', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      duplex: 'half',
    } as RequestInit)

  it('returns 400, not an unhandled error, when the body stream fails', async () => {
    const stream = new ReadableStream<Uint8Array>({
      pull(controller) {
        controller.error(Object.assign(new Error('socket secret detail'), { name: 'AbortError', code: 'ECONNRESET' }))
      },
    })
    const res = await POST(withBody(stream))
    expect(res.status).toBe(400)
    expect(typeof (await res.json()).error).toBe('string')
    const logged = JSON.stringify(vi.mocked(console.error).mock.calls)
    expect(logged).toMatch(/AbortError/)
    expect(logged).toMatch(/ECONNRESET/)
    expect(logged).not.toMatch(/secret detail/)
    expect(create).not.toHaveBeenCalled()
  })

  it('returns 400 for invalid UTF-8 instead of storing replacement characters', async () => {
    const encoder = new TextEncoder()
    const head = encoder.encode('{"email":"ada@example.com","transcript":[{"role":"user","text":"hi ')
    const tail = encoder.encode('"}]}')
    const bytes = new Uint8Array([...head, 0xff, 0xfe, ...tail])
    const res = await POST(withBody(bytes))
    expect(res.status).toBe(400)
    expect(create).not.toHaveBeenCalled()
  })

  it('returns 400 for a body that ends in the middle of a multi-byte character', async () => {
    const bytes = new TextEncoder().encode('{"a":"é"}')
    const res = await POST(withBody(bytes.slice(0, bytes.indexOf(0xc3) + 1)))
    expect(res.status).toBe(400)
  })
})

describe('other methods', () => {
  it.each([
    ['GET', GET],
    ['PUT', PUT],
    ['PATCH', PATCH],
    ['DELETE', DELETE],
  ])('%s returns 405 with an Allow header', async (_m, handler) => {
    const res = handler()
    expect(res.status).toBe(405)
    expect(res.headers.get('allow')).toBe('POST')
  })
})
