import { vi } from 'vitest'

const findMany = vi.fn()
vi.mock('../server/db.ts', () => ({ db: () => ({ intake: { findMany } }) }))

import { GET, POST } from './intakes'

const get = (headers: Record<string, string> = {}) =>
  GET(new Request('http://localhost/api/intakes', { headers }))

describe('GET /api/intakes', () => {
  beforeEach(() => {
    findMany.mockReset()
    process.env.DOCTOR_TOKEN = 'secret-token'
  })

  it('returns 401 without a token and never reads the database', async () => {
    expect((await get()).status).toBe(401)
    expect(findMany).not.toHaveBeenCalled()
  })

  it('returns 401 for a wrong token', async () => {
    expect((await get({ authorization: 'Bearer nope' })).status).toBe(401)
    expect(findMany).not.toHaveBeenCalled()
  })

  it('returns 401 for every request when DOCTOR_TOKEN is unset', async () => {
    delete process.env.DOCTOR_TOKEN
    expect((await get({ authorization: 'Bearer undefined' })).status).toBe(401)
    expect((await get({ authorization: 'Bearer ' })).status).toBe(401)
  })

  it('rejects a raw token with no Bearer scheme', async () => {
    expect((await get({ authorization: 'secret-token' })).status).toBe(401)
  })

  it('selects only the fields the doctor view uses', async () => {
    findMany.mockResolvedValue([])
    await get({ authorization: 'Bearer secret-token' })
    expect(findMany).toHaveBeenCalledWith(
      expect.objectContaining({ select: { id: true, createdAt: true, name: true, email: true, transcript: true } }),
    )
  })

  it('returns intakes newest first for the right token, uncached', async () => {
    const rows = [{ id: 'a', createdAt: '2026-10-20T00:00:00.000Z', name: 'Ada', email: 'ada@example.com', transcript: [] }]
    findMany.mockResolvedValue(rows)
    const res = await get({ authorization: 'Bearer secret-token' })
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(await res.json()).toEqual(rows)
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ orderBy: { createdAt: 'desc' } }))
  })

  it('returns a generic 500 when the database fails', async () => {
    findMany.mockRejectedValue(new Error('db.secret.supabase.co refused'))
    const res = await get({ authorization: 'Bearer secret-token' })
    expect(res.status).toBe(500)
    expect(await res.text()).not.toMatch(/secret\.supabase|refused/)
  })

  it('rejects other methods with 405', () => {
    expect(POST().status).toBe(405)
  })
})
