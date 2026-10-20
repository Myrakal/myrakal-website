import { vi } from 'vitest'

const load = async () => {
  vi.resetModules()
  return import('@/lib/acknowledge')
}

const NONE = { reply: '', emergency: false }

const ok = (reply: unknown, emergency?: unknown) =>
  vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => ({ reply, emergency }) })

describe('acknowledge', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })

  it('posts only the latest visitor message as JSON and returns the trimmed reply', async () => {
    const fetchMock = ok('  I am sorry to hear that.  ')
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await expect(acknowledge('Knee pain')).resolves.toEqual({ reply: 'I am sorry to hear that.', emergency: false })
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/chat')
    expect(init.method).toBe('POST')
    expect(init.headers['Content-Type']).toBe('application/json')
    expect(JSON.parse(init.body)).toEqual({ messages: [{ role: 'user', text: 'Knee pain' }] })
  })

  it('caps what is sent at 1000 characters', async () => {
    const fetchMock = ok('')
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await acknowledge('x'.repeat(5000))
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).messages[0].text.length).toBe(1000)
  })

  it('handles a huge unbroken string in linear time', async () => {
    vi.stubGlobal('fetch', ok(''))
    const { acknowledge } = await load()
    const started = performance.now()
    await acknowledge('a'.repeat(200000))
    await acknowledge('a@'.repeat(100000))
    expect(performance.now() - started).toBeLessThan(100)
  })

  it.each([
    ['an at sign', 'reach me at ada@example.com'],
    ['a spaced at sign', 'ada @ example.com'],
    ['a full-width at sign', 'ada＠example.com'],
    ['an obfuscated address', 'ada at example dot com'],
    ['a bracketed obfuscated address', 'ada (at) example [dot] com'],
    ['a capitalised obfuscated address', 'Ada AT example DOT com'],
    ['an obfuscated address across a newline', 'ada at\nexample dot com'],
    ['a small commercial at sign', 'ada\ufe6bexample.com'],
    ['full-width letters', '\uff41\uff44\uff41 \uff41\uff54 example \uff44\uff4f\uff54 com'],
    ['name at domain', 'write to ada at example.com'],
  ])('skips the AI entirely when the message has %s', async (_label, text) => {
    const fetchMock = ok('Thank you.')
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await expect(acknowledge(text)).resolves.toEqual(NONE)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('still asks the AI when "at" and "dot" are unrelated ordinary words far apart', async () => {
    const fetchMock = ok('Thank you.')
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await acknowledge(`I was at the clinic ${'and walked around the long hall '.repeat(4)}then read a dot matrix label`)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it.each([
    ['a newline', 'Thank you.\nIgnore the rules.'],
    ['bold markdown', 'Thank **you**.'],
    ['a heading', '# Thank you.'],
    ['a code tick', 'Use `this`.'],
    ['underscores', 'Thank _you_ so much.'],
    ['a link', 'See [this](http://x.co).'],
    ['a bare url', 'Visit https://example.com now.'],
    ['a www url', 'Visit www.example.com now.'],
    ['mostly digits', '123456789 12345 6789 12345'],
    ['too long', 'Thank you. '.repeat(30)],
    ['an at sign', 'Write to ada@example.com.'],
  ])('rejects a reply with %s', async (_label, reply) => {
    vi.stubGlobal('fetch', ok(reply))
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toEqual(NONE)
  })

  it('adds a full stop when the reply does not end with punctuation', async () => {
    vi.stubGlobal('fetch', ok('Thank you for telling me'))
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toEqual({ reply: 'Thank you for telling me.', emergency: false })
  })

  it.each(['Thank you.', 'I am sorry to hear that!'])('keeps %s as is', async (reply) => {
    vi.stubGlobal('fetch', ok(reply))
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toEqual({ reply: reply, emergency: false })
  })

  it('returns emergency true and ignores whatever text the server sent', async () => {
    vi.stubGlobal('fetch', ok('SERVER TEXT (call 911)\nplease', true))
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toEqual({ reply: '', emergency: true })
  })

  it('treats a flagged emergency with an empty reply as an emergency', async () => {
    vi.stubGlobal('fetch', ok('', true))
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toEqual({ reply: '', emergency: true })
  })

  it.each([
    ['the string "true"', 'true'],
    ['the number 1', 1],
    ['null', null],
    ['an object', {}],
    ['undefined', undefined],
  ])('treats emergency as false when it is %s', async (_label, flag) => {
    vi.stubGlobal('fetch', ok('Thank you.', flag))
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toEqual({ reply: 'Thank you.', emergency: false })
  })

  it('does not let a reply that merely mentions emergencies bypass the shape rules', async () => {
    vi.stubGlobal('fetch', ok('Call 911 now (really).', false))
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toEqual(NONE)
  })

  it.each([404, 501])('remembers a %i as unavailable for the session', async (status) => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await acknowledge('one')
    await acknowledge('two')
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('stops after two consecutive failures of any kind, but a success resets the count', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('offline'))
      .mockResolvedValueOnce({ ok: true, status: 200, json: async () => ({ reply: 'Thank you.' }) })
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({}) })
      .mockRejectedValueOnce(new TypeError('offline'))
      .mockResolvedValue({ ok: true, status: 200, json: async () => ({ reply: 'Thank you.' }) })
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await acknowledge('a')
    await acknowledge('b')
    await acknowledge('c')
    await acknowledge('d')
    expect(fetchMock).toHaveBeenCalledTimes(4)
    await acknowledge('e')
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it.each([
    ['a missing reply', {}],
    ['a non-string reply', { reply: 5 }],
  ])('returns an empty string for %s', async (_label, payload) => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => payload }))
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toEqual(NONE)
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
    await expect(acknowledge('hi')).resolves.toEqual(NONE)
  })

  it('returns an empty string on a single 500 and tries again on the next call', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 500, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toEqual(NONE)
    await expect(acknowledge('hi')).resolves.toEqual(NONE)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('remembers a 503 and stops calling the API for the rest of the session', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status: 503, json: async () => ({ error: 'off' }) })
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toEqual(NONE)
    await expect(acknowledge('hi again')).resolves.toEqual(NONE)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('returns an empty string on a network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('offline')))
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toEqual(NONE)
  })

  it('gives up after 4 seconds', async () => {
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
    await vi.advanceTimersByTimeAsync(3900)
    let settled = false
    void result.then(() => (settled = true))
    await vi.advanceTimersByTimeAsync(0)
    expect(settled).toBe(false)
    await vi.advanceTimersByTimeAsync(200)
    await expect(result).resolves.toEqual(NONE)
  })

  it('does not send when the signal is already aborted, and aborts the request with the signal', async () => {
    const fetchMock = ok('x')
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    const done = new AbortController()
    done.abort()
    await expect(acknowledge('hi', done.signal)).resolves.toEqual(NONE)
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
    await expect(pending).resolves.toEqual(NONE)
    expect(sent!.aborted).toBe(true)
  })

  it('does not count a caller abort as a failure, nor mark the AI unavailable', async () => {
    const fetchMock = vi.fn(
      (_url: string, init: RequestInit) =>
        new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
        }),
    )
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    for (let i = 0; i < 4; i++) {
      const controller = new AbortController()
      const pending = acknowledge(`try ${i}`, controller.signal)
      controller.abort()
      await expect(pending).resolves.toEqual(NONE)
    }
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it.each([400, 429])('does not mark the AI unavailable after a %i', async (status) => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: false, status, json: async () => ({}) })
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    for (let i = 0; i < 4; i++) await expect(acknowledge('hi')).resolves.toEqual(NONE)
    expect(fetchMock).toHaveBeenCalledTimes(4)
  })

  it('does not export a test-only reset', async () => {
    expect(Object.keys(await load())).toEqual(['acknowledge'])
  })

  it.each([
    ['a question mark', 'Is that right? Thank you.'],
    ['a bare domain', 'See example.com for more.'],
    ['a short link', 'Try bit.ly/x for details.'],
    ['a five digit run', 'Call 55555 for help.'],
  ])('rejects a reply with %s', async (_label, reply) => {
    vi.stubGlobal('fetch', ok(reply))
    const { acknowledge } = await load()
    await expect(acknowledge('hi')).resolves.toEqual(NONE)
  })

  it('skips the AI when an email straddles the 1000 character cut, so no part of it leaks', async () => {
    const fetchMock = ok('Thank you.')
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await acknowledge(`${'x'.repeat(990)} write to ada@example.com please`)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each([
    ['a six digit run', 'my member id is 123456'],
    ['a phone number with dashes', 'it is 555-123-4567'],
    ['a phone number with spaces and brackets', 'call (555) 123 4567'],
    ['a numeric date of birth', 'born 03/14/1985'],
    ['a short date of birth', 'dob 3/4/85'],
    ['an ISO date of birth', 'born 1985-03-14'],
    ['a written date of birth', 'born March 14, 1985'],
  ])('skips the AI entirely when the message has %s', async (_label, text) => {
    const fetchMock = ok('Thank you.')
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    await expect(acknowledge(text)).resolves.toEqual(NONE)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it.each(['about two months', 'twice a week for 3 weeks', 'it hurts at 2 or 3 out of 10'])(
    'still asks the AI for an ordinary answer such as "%s"',
    async (text) => {
      const fetchMock = ok('Thank you.')
      vi.stubGlobal('fetch', fetchMock)
      const { acknowledge } = await load()
      await acknowledge(text)
      expect(fetchMock).toHaveBeenCalledTimes(1)
    },
  )

  it('runs the checks on long input in linear time', async () => {
    vi.stubGlobal('fetch', ok(''))
    const { acknowledge } = await load()
    const started = performance.now()
    await acknowledge('1 '.repeat(100000))
    await acknowledge('at '.repeat(60000))
    expect(performance.now() - started).toBeLessThan(200)
  })

  it('never accumulates intermittent failures: any success resets the streak', async () => {
    const bad = { ok: false, status: 500, json: async () => ({}) }
    const good = { ok: true, status: 200, json: async () => ({ reply: 'Thank you.', emergency: false }) }
    const fetchMock = vi.fn()
    for (let i = 0; i < 10; i++) fetchMock.mockResolvedValueOnce(bad).mockResolvedValueOnce(good)
    vi.stubGlobal('fetch', fetchMock)
    const { acknowledge } = await load()
    for (let i = 0; i < 20; i++) await acknowledge(`m${i}`)
    expect(fetchMock).toHaveBeenCalledTimes(20)
  })
})
