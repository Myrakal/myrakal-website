const updateMany = jest.fn()
const findFirst = jest.fn()
const commentCreate = jest.fn()
const requireUser = jest.fn()
const tx = { chat: { updateMany, findFirst }, comment: { create: commentCreate } }
jest.mock('@/server/db', () => ({ db: () => ({ ...tx, $transaction: (fn: (t: typeof tx) => unknown) => fn(tx) }) }))
jest.mock('@/server/auth', () => ({ requireUser: () => requireUser() }))

import { POST } from './route'

const ID = '3f2b8c1e-9d4a-4e6b-8a1f-2c7d5e9b0a13'
const headers = { host: 'myrakal.com', origin: 'https://myrakal.com', 'content-type': 'application/json' }
const call = (body: unknown, opts: { id?: string; headers?: Record<string, string> } = {}) => {
  const id = opts.id ?? ID
  return POST(
    new Request(`https://myrakal.com/api/chats/${id}/comments`, {
      method: 'POST',
      headers: opts.headers ?? headers,
      body: typeof body === 'string' ? body : JSON.stringify(body),
    }),
    { params: Promise.resolve({ id }) },
  )
}

beforeEach(() => {
  jest.clearAllMocks()
  requireUser.mockResolvedValue({ id: 'u1' })
  updateMany.mockResolvedValue({ count: 1 })
  commentCreate.mockResolvedValue({ id: 'k1' })
})

describe('POST /api/chats/:id/comments', () => {
  it('returns 403 on a cross-site request', async () => {
    expect((await call({ text: 'hi' }, { headers: { ...headers, origin: 'https://evil.com' } })).status).toBe(403)
    expect(updateMany).not.toHaveBeenCalled()
  })

  it('returns 401 without a session', async () => {
    requireUser.mockResolvedValue(null)
    expect((await call({ text: 'hi' })).status).toBe(401)
  })

  it('returns 404 for a malformed id', async () => {
    expect((await call({ text: 'hi' }, { id: 'nope' })).status).toBe(404)
  })

  it.each([['not json'], [{}], [{ text: 5 }], [{ text: '   ' }], [{ text: 'x'.repeat(4001) }], [{ text: 'hi\u0000' }]])('returns 400 for invalid body %p', async (body) => {
    expect((await call(body)).status).toBe(400)
    expect(updateMany).not.toHaveBeenCalled()
  })

  it('moves plan_ready to clarification_review conditionally and stores the trimmed comment', async () => {
    const res = await call({ text: '  Can we add a day?  ' })
    expect(res.status).toBe(201)
    expect(await res.json()).toEqual({ status: 'clarification_review' })
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: ID, userId: 'u1', status: 'plan_ready' },
      data: { status: 'clarification_review' },
    })
    expect(commentCreate).toHaveBeenCalledWith({ data: { chatId: ID, text: 'Can we add a day?' } })
  })

  it('accepts exactly 4000 characters', async () => {
    expect((await call({ text: 'x'.repeat(4000) })).status).toBe(201)
  })

  it('returns 409 when the chat exists but is not in plan_ready', async () => {
    updateMany.mockResolvedValue({ count: 0 })
    findFirst.mockResolvedValue({ id: ID })
    expect((await call({ text: 'hi' })).status).toBe(409)
    expect(commentCreate).not.toHaveBeenCalled()
  })

  it('returns 404 when the chat is not owned by the caller', async () => {
    updateMany.mockResolvedValue({ count: 0 })
    findFirst.mockResolvedValue(null)
    expect((await call({ text: 'hi' })).status).toBe(404)
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: ID, userId: 'u1' } }))
    expect(commentCreate).not.toHaveBeenCalled()
  })
})
