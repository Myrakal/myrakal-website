import { vi } from 'vitest'

const create = vi.fn()
vi.mock('../server/db.ts', () => ({ db: () => ({ intake: { create } }) }))

import { DELETE, GET, PATCH, POST, PUT } from './intake'

const body = {
  email: 'ada@example.com',
  transcript: [{ role: 'user', text: 'Knee pain' }],
}

const post = (payload: unknown, raw = false) =>
  POST(
    new Request('http://localhost/api/intake', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
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
