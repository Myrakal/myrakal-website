import { vi } from 'vitest'

const findMany = vi.fn()
const updateMany = vi.fn()
const findUnique = vi.fn()
vi.mock('../server/db.ts', () => ({ db: () => ({ intake: { findMany, updateMany, findUnique } }) }))

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
      expect.objectContaining({ select: { id: true, createdAt: true, name: true, email: true, transcript: true, consultStatus: true, paidAt: true, consultNote: true, reviewedAt: true } }),
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
})

const ID = '3f2b8c1e-5a7d-4e9f-8b6a-1c2d3e4f5a6b'
const post = (body: unknown, headers: Record<string, string> = { authorization: 'Bearer secret-token' }) =>
  POST(new Request('http://localhost/api/intakes', { method: 'POST', headers, body: typeof body === 'string' ? body : JSON.stringify(body) }))

describe('POST /api/intakes', () => {
  beforeEach(() => {
    updateMany.mockReset()
    findUnique.mockReset()
    process.env.DOCTOR_TOKEN = 'secret-token'
  })

  it('returns 401 without a valid token and never writes', async () => {
    expect((await post({ id: ID, decision: 'approved' }, {})).status).toBe(401)
    expect((await post({ id: ID, decision: 'approved' }, { authorization: 'Bearer nope' })).status).toBe(401)
    expect(updateMany).not.toHaveBeenCalled()
  })

  it('rejects bad json, bad ids, bad decisions and bad notes with 400', async () => {
    for (const body of [
      'not json',
      { id: 'x', decision: 'approved' },
      { id: ID, decision: 'rejected' },
      { id: ID, decision: 'changes_requested' },
      { id: ID, decision: 'changes_requested', note: '   ' },
      { id: ID, decision: 'approved', note: 5 },
      { id: ID, decision: 'approved', note: 'a'.repeat(4001) },
    ]) {
      expect((await post(body)).status).toBe(400)
    }
    expect(updateMany).not.toHaveBeenCalled()
  })

  it('only updates intakes that are in review', async () => {
    updateMany.mockResolvedValue({ count: 1 })
    const res = await post({ id: ID, decision: 'changes_requested', note: '  Get an MRI  ' })
    expect(res.status).toBe(200)
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: ID, consultStatus: 'in_review' },
      data: { consultStatus: 'changes_requested', consultNote: 'Get an MRI', reviewedAt: expect.any(Date) },
    })
    const body = await res.json()
    expect(body).toMatchObject({ id: ID, consultStatus: 'changes_requested', consultNote: 'Get an MRI' })
  })

  it('stores a null note when approving without one', async () => {
    updateMany.mockResolvedValue({ count: 1 })
    expect((await post({ id: ID, decision: 'approved' })).status).toBe(200)
    expect(updateMany.mock.calls[0][0].data).toMatchObject({ consultStatus: 'approved', consultNote: null })
  })

  it('returns 409 when the intake is not in review and 404 when it does not exist', async () => {
    updateMany.mockResolvedValue({ count: 0 })
    findUnique.mockResolvedValueOnce({ id: ID })
    expect((await post({ id: ID, decision: 'approved' })).status).toBe(409)
    findUnique.mockResolvedValueOnce(null)
    expect((await post({ id: ID, decision: 'approved' })).status).toBe(404)
  })

  it('returns a generic 500 when the database fails', async () => {
    updateMany.mockRejectedValue(new Error('db.secret.supabase.co refused'))
    const res = await post({ id: ID, decision: 'approved' })
    expect(res.status).toBe(500)
    expect(await res.text()).not.toMatch(/secret\.supabase|refused/)
  })

  it('rejects other methods with 405 allowing GET and POST', async () => {
    const mod = await import('./intakes')
    for (const m of [mod.PUT, mod.PATCH, mod.DELETE]) {
      const res = m()
      expect(res.status).toBe(405)
      expect(res.headers.get('allow')).toBe('GET, POST')
    }
  })
})
