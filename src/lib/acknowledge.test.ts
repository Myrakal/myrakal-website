import { vi } from 'vitest'

const load = async () => {
  vi.resetModules()
  return import('@/lib/acknowledge')
}

const ok = (reply: unknown) => vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ reply }) })

describe('acknowledge', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('posts only the latest visitor message as JSON and returns the trimmed reply', async () => {
    const fetchMock = ok('  I am sorry to hear that.  ')
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await expect(acknowledge('Knee pain')).resolves.toBe('I am sorry to hear that.')
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/chat')
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({ messages: [{ role: 'user', text: 'Knee pain' }] })
  })

  it('replaces email addresses with [email] before sending', async () => {
    const fetchMock = ok('')
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await acknowledge("reach me at ada@example.com or o'brien@x.co.uk, thanks")
    const body = fetchMock.mock.calls[0][1].body as string
    expect(body).not.toMatch(/@/)
    expect(JSON.parse(body).messages[0].text).toBe('reach me at [email] or [email], thanks')
  })

  it.each([
    ['a missing reply', {}],
    ['a non-string reply', { reply: 5 }],
  ])('returns an empty string for %s', async (_label, payload) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => payload }))
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toBe('')
  })

  it('returns an empty string when the body is not JSON', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('bad')
        },
      }),
    )
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toBe('')
  })

  it('returns an empty string on a 500 and keeps trying on later calls', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toBe('')
    await expect(acknowledge('hi')).resolves.toBe('')
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('remembers a 503 and stops calling the API for the rest of the session', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({ error: 'off' }) })
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toBe('')
    await expect(acknowledge('hi again')).resolves.toBe('')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('returns an empty string on a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toBe('')
  })

  it('gives up after 6 seconds', async () => {
    vi.useFakeTimers()
    vi.stubGlobal(
      'fetch',
      vi.fn(
        (_url: string, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
          }),
      ),
    )
    const { acknowledge } = await load()
    const result = acknowledge('hi')
    await vi.advanceTimersByTimeAsync(5900)
    let settled = false
    void result.then(() => (settled = true))
    await vi.advanceTimersByTimeAsync(0)
    expect(settled).toBe(false)
    await vi.advanceTimersByTimeAsync(200)
    await expect(result).resolves.toBe('')
  })

  it('does not send when the signal is already aborted, and aborts the request with the signal', async () => {
    const fetchMock = ok('x')
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    const done = new AbortController()
    done.abort()
    await expect(acknowledge('hi', done.signal)).resolves.toBe('')
    expect(fetchMock).not.toHaveBeenCalled()

    let sent: AbortSignal | undefined
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init: RequestInit) => {
        sent = init.signal as AbortSignal
        return new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
        })
      }),
    )
    const live = new AbortController()
    const pending = acknowledge('hi', live.signal)
    live.abort()
    await expect(pending).resolves.toBe('')
    expect(sent!.aborted).toBe(true)
  })
})
