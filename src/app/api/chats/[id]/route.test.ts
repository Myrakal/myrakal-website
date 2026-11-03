const findFirst = jest.fn()
const requireUser = jest.fn()
jest.mock('@/server/db', () => ({ db: () => ({ chat: { findFirst } }) }))
jest.mock('@/server/auth', () => ({ requireUser: () => requireUser() }))

import { GET } from './route'

const ID = '3f2b8c1e-9d4a-4e6b-8a1f-2c7d5e9b0a13'
const call = (id = ID) => GET(new Request(`https://myrakal.com/api/chats/${id}`), { params: Promise.resolve({ id }) })
const t = new Date('2026-10-22T10:00:00Z')

beforeEach(() => {
  jest.clearAllMocks()
  requireUser.mockResolvedValue({ id: 'u1' })
})

describe('GET /api/chats/:id', () => {
  it('returns 401 without a session', async () => {
    requireUser.mockResolvedValue(null)
    expect((await call()).status).toBe(401)
    expect(findFirst).not.toHaveBeenCalled()
  })

  it('returns 404 for a malformed id without querying', async () => {
    expect((await call('nope')).status).toBe(404)
    expect(findFirst).not.toHaveBeenCalled()
  })

  it('returns 404 when the chat is not owned by the caller', async () => {
    findFirst.mockResolvedValue(null)
    expect((await call()).status).toBe(404)
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: ID, userId: 'u1' } }))
  })

  it('returns the chat with transcript, comments, paid flag and server-computed progress', async () => {
    findFirst.mockResolvedValue({
      id: ID,
      status: 'intake',
      createdAt: t,
      priceCents: null,
      paidAt: null,
      intake: { condition: 'knee pain' },
      messages: [{ id: 'm1', role: 'user', text: 'hi', createdAt: t, chatId: ID }],
      comments: [{ id: 'k1', text: 'note', createdAt: t, chatId: ID }],
    })
    const res = await call()
    expect(res.status).toBe(200)
    expect(res.headers.get('cache-control')).toBe('no-store')
    const body = await res.json()
    expect(body).toEqual({
      id: ID,
      status: 'intake',
      createdAt: t.toISOString(),
      priceCents: 5000,
      paid: false,
      progress: { collected: 1, total: expect.any(Number) },
      attachmentRequest: null,
      intake: { condition: 'knee pain' },
      messages: [{ id: 'm1', role: 'user', text: 'hi', createdAt: t.toISOString() }],
      comments: [{ id: 'k1', text: 'note', createdAt: t.toISOString() }],
    })
  })

  it('falls back to PLAN_PRICE_CENTS when the chat has no price', async () => {
    process.env.PLAN_PRICE_CENTS = '20000'
    findFirst.mockResolvedValue({ id: ID, status: 'plan_ready', createdAt: t, priceCents: null, paidAt: null, intake: {}, messages: [], comments: [] })
    expect((await (await call()).json()).priceCents).toBe(20000)
    delete process.env.PLAN_PRICE_CENTS
  })

  it('marks paid when paidAt is set', async () => {
    findFirst.mockResolvedValue({ id: ID, status: 'reservations', createdAt: t, priceCents: 9900, paidAt: t, intake: {}, messages: [], comments: [] })
    const body = await (await call()).json()
    expect(body.paid).toBe(true)
    expect(body.priceCents).toBe(9900)
  })

  it('returns the pending attachment request only while in intake', async () => {
    const base = { id: ID, createdAt: t, priceCents: null, paidAt: null, messages: [], comments: [] }
    findFirst.mockResolvedValue({ ...base, status: 'intake', intake: { attachmentRequest: 'scans' } })
    expect((await (await call()).json()).attachmentRequest).toEqual({ label: 'scans' })
    findFirst.mockResolvedValue({ ...base, status: 'doctor_review', intake: { attachmentRequest: 'scans' } })
    expect((await (await call()).json()).attachmentRequest).toBeNull()
    findFirst.mockResolvedValue({ ...base, status: 'intake', intake: {} })
    expect((await (await call()).json()).attachmentRequest).toBeNull()
  })

  it('never leaks internal intake keys', async () => {
    findFirst.mockResolvedValue({ id: ID, status: 'intake', createdAt: t, priceCents: null, paidAt: null, intake: { condition: 'x', attachmentRequest: 'scans', secret: 'y' }, messages: [], comments: [] })
    expect((await (await call()).json()).intake).toEqual({ condition: 'x' })
  })
})
