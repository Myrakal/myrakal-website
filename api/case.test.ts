import { vi } from 'vitest'

const findUnique = vi.fn()
vi.mock('../server/db.ts', () => ({ db: () => ({ intake: { findUnique } }) }))

import { GET, POST } from './case'

const ID = '3f2b8c1e-5d4a-4b7e-9a10-2c6d8e0f1a23'
const get = (id?: string) => GET(new Request(`http://localhost/api/case${id === undefined ? '' : `?id=${id}`}`))

const row = (over: Record<string, unknown> = {}) => ({
  consultStatus: 'in_review',
  name: 'Sam',
  paidAt: new Date('2026-01-01T00:00:00Z'),
  consultNote: 'secret note',
  reviewedAt: null,
  ...over,
})

describe('GET /api/case', () => {
  beforeEach(() => findUnique.mockReset())

  it('rejects a missing or non-uuid id without touching the database', async () => {
    expect((await get()).status).toBe(400)
    expect((await get('abc')).status).toBe(400)
    expect(findUnique).not.toHaveBeenCalled()
  })

  it('returns 404 for an unknown id', async () => {
    findUnique.mockResolvedValue(null)
    expect((await get(ID)).status).toBe(404)
  })

  it('selects only safe fields', async () => {
    findUnique.mockResolvedValue(row())
    await get(ID)
    expect(findUnique).toHaveBeenCalledWith({
      where: { id: ID },
      select: { consultStatus: true, name: true, paidAt: true, consultNote: true, reviewedAt: true },
    })
  })

  it('hides the note while in review and reports paid', async () => {
    findUnique.mockResolvedValue(row())
    const res = await get(ID)
    expect(res.headers.get('cache-control')).toBe('no-store')
    expect(await res.json()).toEqual({ status: 'in_review', name: 'Sam', paid: true, note: null, reviewedAt: null })
  })

  it('hides the note when awaiting payment and reports unpaid', async () => {
    findUnique.mockResolvedValue(row({ consultStatus: 'awaiting_payment', paidAt: null, name: null }))
    expect(await (await get(ID)).json()).toEqual({ status: 'awaiting_payment', name: null, paid: false, note: null, reviewedAt: null })
  })

  it.each(['approved', 'changes_requested'])('returns the note and reviewedAt when %s', async (status) => {
    findUnique.mockResolvedValue(row({ consultStatus: status, reviewedAt: new Date('2026-02-03T04:05:06Z') }))
    expect(await (await get(ID)).json()).toEqual({
      status,
      name: 'Sam',
      paid: true,
      note: 'secret note',
      reviewedAt: '2026-02-03T04:05:06.000Z',
    })
  })

  it('returns 500 when the store fails', async () => {
    findUnique.mockRejectedValue(new Error('boom'))
    expect((await get(ID)).status).toBe(500)
  })

  it('returns 405 with an allow header for other methods', () => {
    const res = POST()
    expect(res.status).toBe(405)
    expect(res.headers.get('allow')).toBe('GET')
  })
})
