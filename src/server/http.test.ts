import { json, sameHost, UUID } from './http'

const req = (headers: Record<string, string>) => new Request('https://myrakal.com/api/chats', { method: 'POST', headers })

describe('json', () => {
  it('serialises with status and no-store', async () => {
    const res = json({ a: 1 }, 201)
    expect(res.status).toBe(201)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(res.headers.get('content-type')).toMatch(/json/)
    expect(await res.json()).toEqual({ a: 1 })
  })

  it('defaults to 200', () => {
    expect(json({}).status).toBe(200)
  })
})

describe('sameHost', () => {
  it('accepts a matching origin', () => {
    expect(sameHost(req({ host: 'myrakal.com', origin: 'https://myrakal.com' }))).toBe(true)
  })

  it('rejects a different origin', () => {
    expect(sameHost(req({ host: 'myrakal.com', origin: 'https://evil.com' }))).toBe(false)
  })

  it('rejects a malformed origin', () => {
    expect(sameHost(req({ host: 'myrakal.com', origin: 'null' }))).toBe(false)
  })

  it('without origin accepts same-origin fetch metadata and rejects cross-site', () => {
    expect(sameHost(req({ host: 'myrakal.com', 'sec-fetch-site': 'same-origin' }))).toBe(true)
    expect(sameHost(req({ host: 'myrakal.com', 'sec-fetch-site': 'cross-site' }))).toBe(false)
  })

  it('without origin or metadata rejects', () => {
    expect(sameHost(req({ host: 'myrakal.com' }))).toBe(false)
  })
})

describe('UUID', () => {
  it('matches only uuids', () => {
    expect(UUID.test('3f2b8c1e-9d4a-4e6b-8a1f-2c7d5e9b0a13')).toBe(true)
    expect(UUID.test('nope')).toBe(false)
  })
})
