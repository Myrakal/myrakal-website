
const mockCreateClient = jest.fn(() => ({}))
jest.mock('@supabase/supabase-js', () => ({ createClient: mockCreateClient }))

const load = async () => {
  jest.resetModules()
  return import('@/lib/supabase')
}

const originalEnv = { ...process.env }

describe('supabase browser client', () => {
  afterEach(() => {
    process.env = { ...originalEnv }
    jest.clearAllMocks()
  })

  it('returns null when the public env vars are not set', async () => {
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = ''
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = ''
    const { getSupabase } = await load()
    expect(getSupabase()).toBeNull()
    expect(mockCreateClient).not.toHaveBeenCalled()
  })

  it('creates one client from the public url and anon key', async () => {
    process.env['NEXT_PUBLIC_SUPABASE_URL'] = 'https://x.supabase.co'
    process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] = 'anon'
    const { getSupabase } = await load()
    expect(getSupabase()).toBe(getSupabase())
    expect(mockCreateClient).toHaveBeenCalledTimes(1)
    expect(mockCreateClient).toHaveBeenCalledWith('https://x.supabase.co', 'anon')
  })
})
