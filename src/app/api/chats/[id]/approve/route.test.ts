const updateMany = jest.fn()
const findFirst = jest.fn()
const requireUser = jest.fn()
jest.mock('@/server/db', () => ({ db: () => ({ chat: { updateMany, findFirst } }) }))
jest.mock('@/server/auth', () => ({ requireUser: () => requireUser() }))

import { POST } from './route'

const ID = '3f2b8c1e-9d4a-4e6b-8a1f-2c7d5e9b0a13'
const headers = { host: 'myrakal.com', origin: 'https://myrakal.com' }
const call = (opts: { id?: string; headers?: Record<string, string> } = {}) => {
  const id = opts.id ?? ID
  return POST(new Request(`https://myrakal.com/api/chats/${id}/approve`, { method: 'POST', headers: opts.headers ?? headers }), {
    params: Promise.resolve({ id }),
  })
}

beforeEach(() => {
  jest.clearAllMocks()
  requireUser.mockResolvedValue({ id: 'u1' })
  updateMany.mockResolvedValue({ count: 1 })
})

describe('POST /api/chats/:id/approve', () => {
  it('returns 403 on a cross-site request', async () => {
    expect((await call({ headers: { ...headers, origin: 'https://evil.com' } })).status).toBe(403)
    expect(updateMany).not.toHaveBeenCalled()
  })

  it('returns 401 without a session', async () => {
    requireUser.mockResolvedValue(null)
    expect((await call()).status).toBe(401)
  })

  it('returns 404 for a malformed id', async () => {
    expect((await call({ id: 'nope' })).status).toBe(404)
    expect(updateMany).not.toHaveBeenCalled()
  })

  it('moves plan_ready to awaiting_payment with a conditional update', async () => {
    const res = await call()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ status: 'awaiting_payment' })
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: ID, userId: 'u1', status: 'plan_ready' },
      data: { status: 'awaiting_payment' },
    })
    expect(res.headers.get('cache-control')).toBe('no-store')
  })

  it('returns 409 when the chat exists in another status', async () => {
    updateMany.mockResolvedValue({ count: 0 })
    findFirst.mockResolvedValue({ id: ID })
    expect((await call()).status).toBe(409)
  })

  it('returns 404 when the chat is not owned by the caller', async () => {
    updateMany.mockResolvedValue({ count: 0 })
    findFirst.mockResolvedValue(null)
    expect((await call()).status).toBe(404)
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: ID, userId: 'u1' } }))
  })
})
