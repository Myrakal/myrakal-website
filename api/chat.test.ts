import { vi } from 'vitest'

const { create } = vi.hoisted(() => ({ create: vi.fn() }))
vi.mock('@anthropic-ai/sdk', () => ({
  default: class {
    static APIError = class extends Error {
      status?: number
    }
    messages = { create }
  },
}))

import { DELETE, GET, PATCH, POST, PUT } from './chat'

const body = {
  messages: [
    { role: 'assistant', text: 'Hi, do you have a diagnosis?' },
    { role: 'user', text: 'Knee pain for two months' },
  ],
}

const post = (payload: unknown, raw = false, headers: Record<string, string> = {}) =>
  POST(
    new Request('http://localhost/api/chat', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: raw ? (payload as BodyInit) : JSON.stringify(payload),
    }),
  )

const modelReply = (text: string, stop_reason = 'end_turn') => ({ stop_reason, content: [{ type: 'text', text }] })

describe('POST /api/chat', () => {
  beforeEach(() => {
    create.mockReset()
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-key')
    vi.stubEnv('ANTHROPIC_MODEL', '')
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.restoreAllMocks()
  })

  it('returns the acknowledgement as { reply }', async () => {
    create.mockResolvedValue(modelReply('Thank you for sharing that.'))
    const res = await post(body)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ reply: 'Thank you for sharing that.' })
  })

  it('returns an empty reply when the output guard rejects the model text', async () => {
    create.mockResolvedValue(modelReply('You should try physical therapy.'))
    const res = await post(body)
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ reply: '' })
  })

  it('uses claude-haiku-5-5 by default and ANTHROPIC_MODEL when set', async () => {
    create.mockResolvedValue(modelReply('Thanks.'))
    await post(body)
    expect(create.mock.calls[0][0].model).toBe('claude-haiku-5-5')
    vi.stubEnv('ANTHROPIC_MODEL', 'claude-sonnet-5-5')
    await post(body)
    expect(create.mock.calls[1][0].model).toBe('claude-sonnet-5-5')
  })

  it('returns 503 and calls nothing when the API key is not set', async () => {
    vi.stubEnv('ANTHROPIC_API_KEY', '')
    const res = await post(body)
    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ error: 'AI replies are not configured' })
    expect(create).not.toHaveBeenCalled()
  })

  it('returns 400 for invalid messages without calling the model', async () => {
    const res = await post({ messages: [{ role: 'assistant', text: 'only me' }] })
    expect(res.status).toBe(400)
    expect(create).not.toHaveBeenCalled()
  })

  it('returns 400 for malformed JSON and invalid UTF-8', async () => {
    expect((await post('{nope', true)).status).toBe(400)
    expect((await post(new Uint8Array([0x7b, 0x22, 0xff, 0x22, 0x7d]), true)).status).toBe(400)
    expect(create).not.toHaveBeenCalled()
  })

  it('returns 415 unless the body is JSON', async () => {
    const res = await post('x', true, { 'content-type': 'text/plain' })
    expect(res.status).toBe(415)
  })

  it('returns 413 over 100000 bytes, by content-length and while streaming', async () => {
    const big = JSON.stringify({ messages: [{ role: 'user', text: 'a'.repeat(100001) }] })
    expect((await post(big, true)).status).toBe(413)
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('{"messages":"'))
        for (let i = 0; i < 4; i++) controller.enqueue(new Uint8Array(40000).fill(97))
        controller.close()
      },
    })
    const res = await POST(
      new Request('http://localhost/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: stream,
        duplex: 'half',
      } as RequestInit),
    )
    expect(res.status).toBe(413)
    expect(create).not.toHaveBeenCalled()
  })

  it('returns 403 for a cross-origin request and allows the same origin', async () => {
    create.mockResolvedValue(modelReply('Thanks.'))
    expect((await post(body, false, { origin: 'https://evil.example' })).status).toBe(403)
    expect((await post(body, false, { origin: 'http://localhost' })).status).toBe(200)
    expect(
      (await post(body, false, { origin: 'https://myrakal.com', 'x-forwarded-host': 'myrakal.com' })).status,
    ).toBe(200)
  })

  it('returns 405 with Allow: POST for other methods', async () => {
    for (const handler of [GET, PUT, PATCH, DELETE]) {
      const res = handler()
      expect(res.status).toBe(405)
      expect(res.headers.get('allow')).toBe('POST')
    }
  })

  it('returns 502 with no internals when the upstream call fails', async () => {
    create.mockRejectedValue(new Error('upstream secret detail about Knee pain for two months'))
    const res = await post(body)
    expect(res.status).toBe(502)
    expect(await res.json()).toEqual({ error: 'Could not generate a reply' })
  })

  it('logs only the error name and status, never message content', async () => {
    const err = Object.assign(new Error('Knee pain for two months ada@example.com'), { name: 'RateLimitError', status: 429 })
    create.mockRejectedValue(err)
    await post(body)
    const logged = JSON.stringify((console.error as ReturnType<typeof vi.fn>).mock.calls)
    expect(logged).toContain('RateLimitError')
    expect(logged).toContain('429')
    expect(logged).not.toMatch(/Knee pain|ada@example|stack/i)
  })
})
