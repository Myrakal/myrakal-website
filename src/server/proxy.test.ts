import { NextRequest } from 'next/server'

const mockGetUser = jest.fn()
let cookieHandlers: { setAll: (c: { name: string; value: string; options?: object }[]) => void }
jest.mock('@supabase/ssr', () => ({
  createServerClient: jest.fn((_url: string, _key: string, opts: { cookies: typeof cookieHandlers }) => {
    cookieHandlers = opts.cookies
    return { auth: { getUser: mockGetUser } }
  }),
}))

import { config, proxy } from '@/proxy'

const originalEnv = { ...process.env }
const req = (path: string) => new NextRequest(`http://localhost:3000${path}`)

beforeEach(() => {
  process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://x.supabase.co'
  process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = 'anon'
  mockGetUser.mockResolvedValue({ data: { user: null } })
})

afterEach(() => {
  process.env = { ...originalEnv }
  jest.clearAllMocks()
})

describe('proxy', () => {
  it.each(['/dashboard', '/chat', '/chats/abc'])('redirects signed-out visitors from %s to /login', async (path) => {
    const res = await proxy(req(path))
    expect(res.status).toBe(307)
    expect(new URL(res.headers.get('location')!).pathname).toBe('/login')
  })

  it.each(['/', '/login', '/privacy', '/chatbot', '/api/chats'])('lets signed-out visitors through on %s', async (path) => {
    const res = await proxy(req(path))
    expect(res.headers.get('location')).toBeNull()
  })

  it('lets signed-in users through to protected pages', async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    const res = await proxy(req('/dashboard'))
    expect(res.headers.get('location')).toBeNull()
  })

  it('fails closed on protected pages when supabase env is missing', async () => {
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = ''
    const res = await proxy(req('/dashboard'))
    expect(res.status).toBe(307)
  })

  it('writes refreshed session cookies onto the response', async () => {
    mockGetUser.mockImplementation(async () => {
      cookieHandlers.setAll([{ name: 'sb-token', value: 'fresh' }])
      return { data: { user: { id: 'u1' } } }
    })
    const res = await proxy(req('/dashboard'))
    expect(res.cookies.get('sb-token')?.value).toBe('fresh')
  })

  it('keeps refreshed cookies on the login redirect', async () => {
    mockGetUser.mockImplementation(async () => {
      cookieHandlers.setAll([{ name: 'sb-token', value: '' }])
      return { data: { user: null } }
    })
    const res = await proxy(req('/chats/abc'))
    expect(res.status).toBe(307)
    expect(res.cookies.get('sb-token')).toBeDefined()
  })

  it('excludes static assets and the stripe webhook from the matcher', () => {
    const re = new RegExp(`^${config.matcher[0]}$`)
    expect(re.test('/api/stripe-webhook')).toBe(false)
    expect(re.test('/_next/static/a.js')).toBe(false)
    expect(re.test('/favicon.svg')).toBe(false)
    expect(re.test('/dashboard')).toBe(true)
    expect(re.test('/api/chats')).toBe(true)
  })
})

describe('proxy failure handling', () => {
  it('serves public pages when supabase throws', async () => {
    mockGetUser.mockRejectedValue(new Error('down'))
    const res = await proxy(req('/'))
    expect(res.status).toBe(200)
  })

  it('redirects protected pages to /login when supabase throws', async () => {
    mockGetUser.mockRejectedValue(new Error('down'))
    const res = await proxy(req('/dashboard'))
    expect(res.status).toBe(307)
  })

  it('forwards cache headers from setAll', async () => {
    mockGetUser.mockImplementation(async () => {
      ;(cookieHandlers.setAll as (c: object[], h: Record<string, string>) => void)([], { 'cache-control': 'private, no-store' })
      return { data: { user: { id: 'u1' } } }
    })
    const res = await proxy(req('/'))
    expect(res.headers.get('cache-control')).toBe('private, no-store')
  })
})
