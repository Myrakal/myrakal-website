const findFirst = jest.fn()
const findMany = jest.fn()
const updateMany = jest.fn()
const messageCreate = jest.fn()
const requireUser = jest.fn()
const runTurn = jest.fn()
const tx = { chat: { updateMany }, message: { create: messageCreate } }
jest.mock('@/server/db', () => ({
  db: () => ({
    chat: { findFirst },
    message: { findMany },
    $transaction: (fn: (t: typeof tx) => unknown) => fn(tx),
  }),
}))
jest.mock('@/server/auth', () => ({ requireUser: () => requireUser() }))
jest.mock('@/server/claude', () => ({
  ClaudeNotConfigured: class ClaudeNotConfigured extends Error {},
  runTurn: (...args: unknown[]) => runTurn(...args),
}))

import { ClaudeNotConfigured } from '@/server/claude'
import { REQUIRED_KEYS } from '@/server/intake'
import * as route from './route'

const ID = '11111111-1111-4111-8111-111111111111'
const params = (id = ID) => ({ params: Promise.resolve({ id }) })
const post = (body: unknown, headers: Record<string, string> = { host: 'myrakal.com', origin: 'https://myrakal.com' }) =>
  new Request(`https://myrakal.com/api/chats/${ID}/messages`, {
    method: 'POST',
    headers,
    body: typeof body === 'string' ? body : JSON.stringify(body),
  })

const createdAt = new Date('2026-10-22T10:00:00Z')

beforeEach(() => {
  jest.resetAllMocks()
  requireUser.mockResolvedValue({ id: 'u1' })
  findFirst.mockResolvedValue({ status: 'intake', intake: { name: 'Ada' } })
  findMany.mockResolvedValue([{ role: 'user', text: 'hi' }, { role: 'assistant', text: 'hello' }])
  runTurn.mockResolvedValue({ reply: 'When were you born?', updates: { dob: '1990-01-01' } })
  updateMany.mockResolvedValue({ count: 1 })
  messageCreate.mockImplementation(({ data }) => Promise.resolve({ id: `m-${data.role}`, createdAt, ...data }))
})

describe('POST /api/chats/:id/messages', () => {
  it('returns 403 on a cross-site request', async () => {
    const res = await route.POST(post({ text: 'x' }, { host: 'myrakal.com', origin: 'https://evil.com' }), params())
    expect(res.status).toBe(403)
    expect(runTurn).not.toHaveBeenCalled()
  })

  it('returns 401 without a session', async () => {
    requireUser.mockResolvedValue(null)
    expect((await route.POST(post({ text: 'x' }), params())).status).toBe(401)
  })

  it('returns 404 for a malformed id', async () => {
    expect((await route.POST(post({ text: 'x' }), params('nope'))).status).toBe(404)
  })

  it.each([[{}], [{ text: '   ' }], [{ text: 5 }], [{ text: 'a'.repeat(4001) }], ['not json']])('returns 400 for body %j', async (body) => {
    expect((await route.POST(post(body), params())).status).toBe(400)
    expect(runTurn).not.toHaveBeenCalled()
  })

  it('returns 404 for a chat the caller does not own', async () => {
    findFirst.mockResolvedValue(null)
    const res = await route.POST(post({ text: 'x' }), params())
    expect(res.status).toBe(404)
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: ID, userId: 'u1' } }))
  })

  it('returns 409 outside intake', async () => {
    findFirst.mockResolvedValue({ status: 'doctor_review', intake: {} })
    expect((await route.POST(post({ text: 'x' }), params())).status).toBe(409)
    expect(runTurn).not.toHaveBeenCalled()
  })

  it('runs the turn with history plus the new text and stored intake', async () => {
    await route.POST(post({ text: '  born in 1990 ' }), params())
    expect(runTurn).toHaveBeenCalledWith({
      history: [
        { role: 'user', text: 'hi' },
        { role: 'assistant', text: 'hello' },
        { role: 'user', text: 'born in 1990' },
      ],
      intake: { name: 'Ada' },
    })
  })

  it('persists both messages, merges intake conditionally and returns reply with progress', async () => {
    const res = await route.POST(post({ text: 'born in 1990' }), params())
    expect(res.status).toBe(200)
    expect(messageCreate).toHaveBeenCalledWith({ data: { chatId: ID, role: 'user', text: 'born in 1990' } })
    expect(messageCreate).toHaveBeenCalledWith({ data: { chatId: ID, role: 'assistant', text: 'When were you born?' } })
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: ID, userId: 'u1', status: 'intake' },
      data: { intake: { name: 'Ada', dob: '1990-01-01' } },
    })
    expect(await res.json()).toEqual({
      reply: { id: 'm-assistant', role: 'assistant', text: 'When were you born?', createdAt: createdAt.toISOString() },
      status: 'intake',
      progress: { collected: 2, total: REQUIRED_KEYS.length },
    })
    expect(res.headers.get('cache-control')).toBe('no-store')
  })

  it('returns 409 and stores nothing when the status changed during the turn', async () => {
    updateMany.mockResolvedValue({ count: 0 })
    const res = await route.POST(post({ text: 'x' }), params())
    expect(res.status).toBe(409)
  })

  it('stores a fallback when Claude returns no text', async () => {
    runTurn.mockResolvedValue({ reply: '', updates: {} })
    const res = await route.POST(post({ text: 'x' }), params())
    expect((await res.json()).reply.text).toMatch(/try again|repeat/i)
  })

  it('returns 503 when Claude is not configured and stores nothing', async () => {
    runTurn.mockRejectedValue(new ClaudeNotConfigured())
    expect((await route.POST(post({ text: 'x' }), params())).status).toBe(503)
    expect(messageCreate).not.toHaveBeenCalled()
  })

  it('returns 502 when Claude fails and stores nothing', async () => {
    runTurn.mockRejectedValue(new Error('upstream'))
    expect((await route.POST(post({ text: 'x' }), params())).status).toBe(502)
    expect(messageCreate).not.toHaveBeenCalled()
  })
})
