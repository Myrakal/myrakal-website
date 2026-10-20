import { act } from '@testing-library/react'
import { vi } from 'vitest'
import { submitIntake } from '@/lib/submitIntake'

const body = {
  name: 'Ada',
  email: 'ada@example.com',
  transcript: [
    { id: 'a', role: 'assistant' as const, text: 'Hello' },
    { id: 'b', role: 'user' as const, text: 'Hi' },
  ],
}

describe('submitIntake', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('posts the contact and a role/text transcript as JSON', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ id: 'x' }) })
    vi.stubGlobal('fetch', fetchMock)
    await expect(submitIntake(body)).resolves.toEqual({ id: 'x' })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/intake')
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({
      name: 'Ada',
      email: 'ada@example.com',
      transcript: [
        { role: 'assistant', text: 'Hello' },
        { role: 'user', text: 'Hi' },
      ],
    })
  })

  it('throws on a non-2xx response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({ error: 'no' }) }))
    await expect(submitIntake(body)).rejects.toThrow(/500/)
  })

  it('throws when the network fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    await expect(submitIntake(body)).rejects.toThrow()
  })

  it('treats any 2xx as success even without a JSON body', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 204, json: async () => { throw new SyntaxError('empty') } }))
    await expect(submitIntake(body)).resolves.toEqual({ id: undefined })
  })

  it('aborts and fails after 10 seconds', async () => {
    vi.useFakeTimers()
    try {
      vi.stubGlobal(
        'fetch',
        vi.fn((_url: string, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
          }),
        ),
      )
      const result = submitIntake(body)
      const assertion = expect(result).rejects.toThrow()
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10_000)
      })
      await assertion
    } finally {
      vi.useRealTimers()
    }
  })

  it('aborts when the caller signal aborts', async () => {
    const controller = new AbortController()
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
        }),
      ),
    )
    const result = submitIntake(body, controller.signal)
    controller.abort()
    await expect(result).rejects.toThrow()
  })
})
