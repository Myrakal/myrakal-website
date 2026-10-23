const create = jest.fn()
const findMany = jest.fn()
const requireUser = jest.fn()
jest.mock('@/server/db', () => ({ db: () => ({ chat: { create, findMany } }) }))
jest.mock('@/server/auth', () => ({ requireUser: () => requireUser() }))

import * as route from './route'

const post = (headers: Record<string, string> = { host: 'myrakal.com', origin: 'https://myrakal.com' }) =>
  new Request('https://myrakal.com/api/chats', { method: 'POST', headers })

beforeEach(() => {
  jest.clearAllMocks()
  requireUser.mockResolvedValue({ id: 'u1' })
})

describe('POST /api/chats', () => {
  it('returns 403 on a cross-site request before touching auth', async () => {
    const res = await route.POST(post({ host: 'myrakal.com', origin: 'https://evil.com' }))
    expect(res.status).toBe(403)
    expect(create).not.toHaveBeenCalled()
  })

  it('returns 401 without a session', async () => {
    requireUser.mockResolvedValue(null)
    const res = await route.POST(post())
    expect(res.status).toBe(401)
    expect(create).not.toHaveBeenCalled()
  })

  it('creates a chat for the user and returns 201 with its id', async () => {
    create.mockResolvedValue({ id: 'c1' })
    const res = await route.POST(post())
    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({ id: 'c1' })
    expect(create).toHaveBeenCalledWith({ data: { userId: 'u1' }, select: { id: true } })
    expect(res.headers.get('cache-control')).toBe('no-store')
  })
})

describe('GET /api/chats', () => {
  const get = () => route.GET()

  it('returns 401 without a session', async () => {
    requireUser.mockResolvedValue(null)
    expect((await get()).status).toBe(401)
  })

  it('lists only the caller chats newest first with a summary', async () => {
    const createdAt = new Date('2026-10-22T10:00:00Z')
    findMany.mockResolvedValue([
      { id: 'a', status: 'intake', createdAt, intake: { condition: 'knee replacement' } },
      { id: 'b', status: 'booked', createdAt, intake: {} },
      { id: 'c', status: 'booked', createdAt, intake: { condition: 42 } },
    ])
    const res = await get()
    expect(findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { userId: 'u1' }, orderBy: { createdAt: 'desc' } }))
    expect(await res.json()).toEqual([
      { id: 'a', status: 'intake', createdAt: createdAt.toISOString(), summary: 'knee replacement' },
      { id: 'b', status: 'booked', createdAt: createdAt.toISOString(), summary: null },
      { id: 'c', status: 'booked', createdAt: createdAt.toISOString(), summary: null },
    ])
    expect(res.headers.get('cache-control')).toBe('no-store')
  })
})
