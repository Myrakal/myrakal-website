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
    expect(await res.json()).toEqual({ id: 'ok' })
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

  it('returns 413 when content-length is over 100000 bytes, before parsing', async () => {
    const res = await post('{not json', true, { 'content-length': '100001' })
    expect(res.status).toBe(413)
    expect(create).not.toHaveBeenCalled()
  })

  it('returns 413 when the actual body is over 100000 bytes and no content-length is sent', async () => {
    const res = await post(`{"pad":"${'x'.repeat(100001)}"}`, true)
    expect(res.status).toBe(413)
    expect(create).not.toHaveBeenCalled()
  })

  it('counts bytes, not characters, against the limit', async () => {
    const res = await post(`{"pad":"${'é'.repeat(50001)}"}`, true)
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
