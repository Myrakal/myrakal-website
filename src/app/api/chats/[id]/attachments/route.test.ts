const findFirst = jest.fn()
const requireUser = jest.fn()
const createSignedUploadUrl = jest.fn()
const list = jest.fn()
const from = jest.fn(() => ({ createSignedUploadUrl, list }))
jest.mock('@/server/db', () => ({ db: () => ({ chat: { findFirst } }) }))
jest.mock('@/server/auth', () => ({ requireUser: () => requireUser() }))
jest.mock('@supabase/supabase-js', () => ({ createClient: () => ({ storage: { from } }) }))

import * as route from './route'

const ID = '11111111-1111-4111-8111-111111111111'
const params = (id = ID) => ({ params: Promise.resolve({ id }) })
const headers = { host: 'myrakal.com', origin: 'https://myrakal.com', 'content-type': 'application/json' }
const send = (body: object | null, h: Record<string, string> = headers) =>
  new Request(`https://myrakal.com/api/chats/${ID}/attachments`, { method: 'POST', headers: h, body: JSON.stringify(body) })
const file = (name = 'labs.pdf', size = 10, type = 'application/pdf') => ({ name, size, type })

beforeEach(() => {
  jest.resetAllMocks()
  from.mockImplementation(() => ({ createSignedUploadUrl, list }))
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'svc'
  delete process.env.ATTACHMENT_BUCKET
  requireUser.mockResolvedValue({ id: 'u1' })
  findFirst.mockResolvedValue({ status: 'intake' })
  list.mockResolvedValue({ data: [], error: null })
  createSignedUploadUrl.mockResolvedValue({ data: { token: 'tok', path: 'p', signedUrl: 'u' }, error: null })
})

describe('POST /api/chats/:id/attachments', () => {
  it('rejects cross-site requests', async () => {
    expect((await route.POST(send(file(), { ...headers, origin: 'https://evil.com' }), params())).status).toBe(403)
  })

  it('requires a user', async () => {
    requireUser.mockResolvedValue(null)
    expect((await route.POST(send(file()), params())).status).toBe(401)
  })

  it('404s for a bad id or a chat the user does not own', async () => {
    expect((await route.POST(send(file()), params('nope'))).status).toBe(404)
    findFirst.mockResolvedValue(null)
    expect((await route.POST(send(file()), params())).status).toBe(404)
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: ID, userId: 'u1' } }))
  })

  it('409s when the chat is past intake', async () => {
    findFirst.mockResolvedValue({ status: 'doctor_review' })
    expect((await route.POST(send(file()), params())).status).toBe(409)
  })

  it('400s on a missing body, a bad type or an empty file', async () => {
    expect((await route.POST(send(null), params())).status).toBe(400)
    expect((await route.POST(send(file('a.exe', 10, 'application/x-msdownload')), params())).status).toBe(400)
    expect((await route.POST(send(file('a.pdf', 0)), params())).status).toBe(400)
    expect(createSignedUploadUrl).not.toHaveBeenCalled()
  })

  it('413s above 10 MB', async () => {
    expect((await route.POST(send(file('big.pdf', 10 * 1024 * 1024 + 1)), params())).status).toBe(413)
    expect(createSignedUploadUrl).not.toHaveBeenCalled()
  })

  it('429s at ten files', async () => {
    list.mockResolvedValue({ data: Array.from({ length: 10 }, (_, i) => ({ name: `f${i}` })), error: null })
    expect((await route.POST(send(file()), params())).status).toBe(429)
    expect(createSignedUploadUrl).not.toHaveBeenCalled()
  })

  it('signs an upload under the chat folder with a sanitized name', async () => {
    const res = await route.POST(send(file('../my labs (1).pdf')), params())
    expect(res.status).toBe(200)
    expect(from).toHaveBeenCalledWith('attachments')
    const path = createSignedUploadUrl.mock.calls[0][0]
    expect(path).toMatch(new RegExp(`^${ID}/[0-9a-f-]{36}-my_labs_1_.pdf$`))
    expect(await res.json()).toEqual({ bucket: 'attachments', path, token: 'tok', contentType: 'application/pdf' })
  })

  it('infers heic from the extension when the browser type is empty', async () => {
    const res = await route.POST(send(file('scan.HEIC', 10, '')), params())
    expect(res.status).toBe(200)
    expect((await res.json()).contentType).toBe('image/heic')
  })

  it('uses ATTACHMENT_BUCKET when set', async () => {
    process.env.ATTACHMENT_BUCKET = 'custom'
    const res = await route.POST(send(file()), params())
    expect(from).toHaveBeenCalledWith('custom')
    expect((await res.json()).bucket).toBe('custom')
  })

  it('502s when storage fails', async () => {
    createSignedUploadUrl.mockResolvedValue({ data: null, error: new Error('boom') })
    expect((await route.POST(send(file()), params())).status).toBe(502)
  })

  it('infers the type from the extension when the browser reports none', async () => {
    const res = await route.POST(send(file('photo.JPG', 10, '')), params())
    expect((await res.json()).contentType).toBe('image/jpeg')
  })

  it('rejects a gif', async () => {
    expect((await route.POST(send(file('a.gif', 10, 'image/gif')), params())).status).toBe(400)
  })
})
