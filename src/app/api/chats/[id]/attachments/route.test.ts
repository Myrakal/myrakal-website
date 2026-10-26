const findFirst = jest.fn()
const messageCreate = jest.fn()
const requireUser = jest.fn()
const upload = jest.fn()
const list = jest.fn()
const from = jest.fn(() => ({ upload, list }))
jest.mock('@/server/db', () => ({ db: () => ({ chat: { findFirst }, message: { create: messageCreate } }) }))
jest.mock('@/server/auth', () => ({ requireUser: () => requireUser() }))
jest.mock('@supabase/supabase-js', () => ({ createClient: () => ({ storage: { from } }) }))

import * as route from './route'

const ID = '11111111-1111-4111-8111-111111111111'
const params = (id = ID) => ({ params: Promise.resolve({ id }) })
const headers = { host: 'myrakal.com', origin: 'https://myrakal.com' }
const send = (file: File | null, h: Record<string, string> = headers) => {
  const form = new FormData()
  if (file) form.set('file', file)
  return new Request(`https://myrakal.com/api/chats/${ID}/attachments`, { method: 'POST', headers: h, body: form })
}
const pdf = (name = 'labs.pdf', size = 10, type = 'application/pdf') => new File([new Uint8Array(size)], name, { type })

beforeEach(() => {
  jest.resetAllMocks()
  from.mockImplementation(() => ({ upload, list }))
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc'
  delete process.env.ATTACHMENT_BUCKET
  requireUser.mockResolvedValue({ id: 'u1' })
  findFirst.mockResolvedValue({ status: 'intake' })
  list.mockResolvedValue({ data: [], error: null })
  upload.mockResolvedValue({ error: null })
  messageCreate.mockImplementation(({ data }) => Promise.resolve({ ...data, id: 'm1', createdAt: new Date('2026-10-22T10:00:00Z') }))
})

describe('POST /api/chats/:id/attachments', () => {
  it('rejects cross-site requests', async () => {
    expect((await route.POST(send(pdf(), { host: 'myrakal.com', origin: 'https://evil.com' }), params())).status).toBe(403)
  })

  it('requires a user', async () => {
    requireUser.mockResolvedValue(null)
    expect((await route.POST(send(pdf()), params())).status).toBe(401)
  })

  it('404s for a bad id or a chat the user does not own', async () => {
    expect((await route.POST(send(pdf()), params('nope'))).status).toBe(404)
    findFirst.mockResolvedValue(null)
    expect((await route.POST(send(pdf()), params())).status).toBe(404)
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: ID, userId: 'u1' } }))
  })

  it('409s when the chat is past intake', async () => {
    findFirst.mockResolvedValue({ status: 'doctor_review' })
    expect((await route.POST(send(pdf()), params())).status).toBe(409)
  })

  it('400s without a file, with a bad type, or when too large', async () => {
    expect((await route.POST(send(null), params())).status).toBe(400)
    expect((await route.POST(send(pdf('a.exe', 10, 'application/x-msdownload')), params())).status).toBe(400)
    expect((await route.POST(send(pdf('big.pdf', 10 * 1024 * 1024 + 1)), params())).status).toBe(413)
    expect(upload).not.toHaveBeenCalled()
  })

  it('429s at ten files', async () => {
    list.mockResolvedValue({ data: Array.from({ length: 10 }, (_, i) => ({ name: `f${i}` })), error: null })
    expect((await route.POST(send(pdf()), params())).status).toBe(429)
    expect(upload).not.toHaveBeenCalled()
  })

  it('uploads under the chat folder with a sanitized name and records a message', async () => {
    const res = await route.POST(send(pdf('../my labs (1).pdf')), params())
    expect(res.status).toBe(200)
    expect(from).toHaveBeenCalledWith('attachments')
    const [path, , options] = upload.mock.calls[0]
    expect(path).toMatch(new RegExp(`^${ID}/[0-9a-f-]{36}-my_labs_1_.pdf$`))
    expect(options).toEqual(expect.objectContaining({ contentType: 'application/pdf' }))
    expect(messageCreate.mock.calls[0][0].data).toEqual(expect.objectContaining({ chatId: ID, role: 'user', text: '[Attached: my_labs_1_.pdf]' }))
    expect((await res.json()).message).toEqual(expect.objectContaining({ role: 'user', text: '[Attached: my_labs_1_.pdf]' }))
  })

  it('uses ATTACHMENT_BUCKET when set', async () => {
    process.env.ATTACHMENT_BUCKET = 'custom'
    await route.POST(send(pdf()), params())
    expect(from).toHaveBeenCalledWith('custom')
  })

  it('502s and records nothing when storage fails', async () => {
    upload.mockResolvedValue({ error: new Error('boom') })
    expect((await route.POST(send(pdf()), params())).status).toBe(502)
    expect(messageCreate).not.toHaveBeenCalled()
  })

  it('accepts a heic file whose browser type is empty', async () => {
    const res = await route.POST(send(pdf('scan.HEIC', 10, '')), params())
    expect(res.status).toBe(200)
    expect(upload.mock.calls[0][2]).toEqual({ contentType: 'image/heic' })
  })

  it('rejects an oversized body from content-length before parsing it', async () => {
    const res = await route.POST(send(pdf(), { ...headers, 'content-length': String(11 * 1024 * 1024 + 1024) }), params())
    expect(res.status).toBe(413)
    expect(upload).not.toHaveBeenCalled()
  })
})
