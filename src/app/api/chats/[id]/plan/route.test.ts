const findFirst = jest.fn()
const requireUser = jest.fn()
const createSignedUrl = jest.fn()
const from = jest.fn(() => ({ createSignedUrl }))
const createClient = jest.fn(() => ({ storage: { from } }))
jest.mock('@/server/db', () => ({ db: () => ({ chat: { findFirst } }) }))
jest.mock('@/server/auth', () => ({ requireUser: () => requireUser() }))
jest.mock('@supabase/supabase-js', () => ({ createClient: (...a: unknown[]) => (createClient as (...x: unknown[]) => unknown)(...a) }))

import { GET } from './route'

const ID = '3f2b8c1e-9d4a-4e6b-8a1f-2c7d5e9b0a13'
const call = (id = ID) => GET(new Request(`https://myrakal.com/api/chats/${id}/plan`), { params: Promise.resolve({ id }) })

beforeEach(() => {
  jest.clearAllMocks()
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'service'
  delete process.env.PLAN_BUCKET
  requireUser.mockResolvedValue({ id: 'u1' })
  findFirst.mockResolvedValue({ status: 'plan_ready' })
  createSignedUrl.mockResolvedValue({ data: { signedUrl: 'https://signed/plan.pdf' }, error: null })
})

describe('GET /api/chats/:id/plan', () => {
  it('returns 401 without a session', async () => {
    requireUser.mockResolvedValue(null)
    expect((await call()).status).toBe(401)
  })

  it('returns 404 for a malformed id', async () => {
    expect((await call('nope')).status).toBe(404)
    expect(findFirst).not.toHaveBeenCalled()
  })

  it('returns 404 when the chat is not owned by the caller', async () => {
    findFirst.mockResolvedValue(null)
    expect((await call()).status).toBe(404)
    expect(findFirst).toHaveBeenCalledWith(expect.objectContaining({ where: { id: ID, userId: 'u1' } }))
    expect(createSignedUrl).not.toHaveBeenCalled()
  })

  it.each(['intake', 'doctor_review'])('returns 404 in %s without signing', async (status) => {
    findFirst.mockResolvedValue({ status })
    expect((await call()).status).toBe(404)
    expect(createSignedUrl).not.toHaveBeenCalled()
  })

  it.each(['plan_ready', 'clarification_review', 'awaiting_payment', 'reservations', 'booked'])('returns a signed url in %s', async (status) => {
    findFirst.mockResolvedValue({ status })
    const res = await call()
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ url: 'https://signed/plan.pdf' })
    expect(res.headers.get('cache-control')).toBe('no-store')
  })

  it('signs the chat file in the plans bucket with a short expiry using the service role', async () => {
    await call()
    expect(createClient).toHaveBeenCalledWith('https://x.supabase.co', 'service', expect.any(Object))
    expect(from).toHaveBeenCalledWith('plans')
    expect(createSignedUrl).toHaveBeenCalledWith(`${ID}_plan.pdf`, 300)
  })

  it('honours PLAN_BUCKET', async () => {
    process.env.PLAN_BUCKET = 'custom'
    await call()
    expect(from).toHaveBeenCalledWith('custom')
  })

  it('returns 404 when the pdf has not been uploaded', async () => {
    createSignedUrl.mockResolvedValue({ data: null, error: { message: 'Object not found' } })
    expect((await call()).status).toBe(404)
  })

  it('throws on storage failures other than a missing object', async () => {
    createSignedUrl.mockResolvedValue({ data: null, error: { message: 'Invalid API key' } })
    await expect(call()).rejects.toBeDefined()
  })
})
