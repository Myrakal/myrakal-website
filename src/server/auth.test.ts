const getUser = jest.fn()
const createServerClient = jest.fn(() => ({ auth: { getUser } }))
const cookieStore = { getAll: jest.fn(() => []), set: jest.fn() }
jest.mock('@supabase/ssr', () => ({ createServerClient: (...args: unknown[]) => (createServerClient as (...a: unknown[]) => unknown)(...args) }))
jest.mock('next/headers', () => ({ cookies: async () => cookieStore }))

import { requireUser } from './auth'

beforeEach(() => {
  jest.clearAllMocks()
  process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://x.supabase.co'
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'anon'
})

describe('requireUser', () => {
  it('returns the user id for a valid session', async () => {
    getUser.mockResolvedValue({ data: { user: { id: 'u1', email: 'a@b.c' } }, error: null })
    expect(await requireUser()).toEqual({ id: 'u1', email: 'a@b.c' })
    expect(createServerClient).toHaveBeenCalledWith('https://x.supabase.co', 'anon', expect.objectContaining({ cookies: expect.any(Object) }))
  })

  it('returns null without a session', async () => {
    getUser.mockResolvedValue({ data: { user: null }, error: { message: 'no session' } })
    expect(await requireUser()).toBeNull()
  })

  it('returns null when supabase is not configured', async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    expect(await requireUser()).toBeNull()
    expect(getUser).not.toHaveBeenCalled()
  })

  it('swallows cookie write failures from read-only contexts', async () => {
    getUser.mockResolvedValue({ data: { user: { id: 'u1' } }, error: null })
    await requireUser()
    const options = (createServerClient.mock.calls[0] as unknown[])[2] as { cookies: { setAll: (c: { name: string; value: string; options?: object }[]) => void } }
    cookieStore.set.mockImplementation(() => { throw new Error('read-only') })
    expect(() => options.cookies.setAll([{ name: 'a', value: 'b' }])).not.toThrow()
  })
})
