const findFirst = jest.fn()
const messageCreate = jest.fn()
const requireUser = jest.fn()
const info = jest.fn()
const remove = jest.fn()
const from = jest.fn(() => ({ info, remove }))
jest.mock('@/server/db', () => ({ db: () => ({ chat: { findFirst }, message: { create: messageCreate } }) }))
jest.mock('@/server/auth', () => ({ requireUser: () => requireUser() }))
jest.mock('@supabase/supabase-js', () => ({ createClient: () => ({ storage: { from } }) }))

import * as route from './route'

const ID = '11111111-1111-4111-8111-111111111111'
const PATH = `${ID}/22222222-2222-4222-8222-222222222222-labs.pdf`
const params = (id = ID) => ({ params: Promise.resolve({ id }) })
const headers = { host: 'myrakal.com', origin: 'https://myrakal.com', 'content-type': 'application/json' }
const send = (body: object | null, h: Record<string, string> = headers) =>
  new Request(`https://myrakal.com/api/chats/${ID}/attachments/complete`, { method: 'POST', headers: h, body: JSON.stringify(body) })

beforeEach(() => {
  jest.resetAllMocks()
  from.mockImplementation(() => ({ info, remove }))
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc'
  requireUser.mockResolvedValue({ id: 'u1' })
  findFirst.mockResolvedValue({ status: 'intake' })
  info.mockResolvedValue({ data: { size: 1000 }, error: null })
  remove.mockResolvedValue({ error: null })
  messageCreate.mockImplementation(({ data }) => Promise.resolve({ ...data, id: 'm1', createdAt: new Date('2026-10-22T10:00:00Z') }))
})

describe('POST /api/chats/:id/attachments/complete', () => {
  it('rejects cross-site requests and anonymous users', async () => {
    expect((await route.POST(send({ path: PATH }, { ...headers, origin: 'https://evil.com' }), params())).status).toBe(403)
    requireUser.mockResolvedValue(null)
    expect((await route.POST(send({ path: PATH }), params())).status).toBe(401)
  })

  it('404s for a chat the user does not own and 409s past intake', async () => {
    findFirst.mockResolvedValue(null)
    expect((await route.POST(send({ path: PATH }), params())).status).toBe(404)
    findFirst.mockResolvedValue({ status: 'booked' })
    expect((await route.POST(send({ path: PATH }), params())).status).toBe(409)
  })

  it('400s for a path outside this chat or with a bad shape', async () => {
    for (const path of ['', 'x', `${ID}/../etc`, `99999999-9999-4999-8999-999999999999/22222222-2222-4222-8222-222222222222-a.pdf`, 5]) {
      expect((await route.POST(send({ path }), params())).status).toBe(400)
    }
    expect(messageCreate).not.toHaveBeenCalled()
  })

  it('404s when the file never reached storage', async () => {
    info.mockResolvedValue({ data: null, error: new Error('not found') })
    expect((await route.POST(send({ path: PATH }), params())).status).toBe(404)
    expect(messageCreate).not.toHaveBeenCalled()
  })

  it('deletes the file and 413s when it is over 10 MB', async () => {
    info.mockResolvedValue({ data: { size: 10 * 1024 * 1024 + 1 }, error: null })
    expect((await route.POST(send({ path: PATH }), params())).status).toBe(413)
    expect(remove).toHaveBeenCalledWith([PATH])
    expect(messageCreate).not.toHaveBeenCalled()
  })

  it('records an attached message', async () => {
    const res = await route.POST(send({ path: PATH }), params())
    expect(res.status).toBe(200)
    expect(messageCreate.mock.calls[0][0].data).toEqual(expect.objectContaining({ chatId: ID, role: 'user', text: '[Attached: labs.pdf]' }))
    expect((await res.json()).message).toEqual(expect.objectContaining({ role: 'user', text: '[Attached: labs.pdf]' }))
  })
})
