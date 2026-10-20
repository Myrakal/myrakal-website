import { vi } from 'vitest'

const createClient = vi.fn(() => ({}))
vi.mock('@supabase/supabase-js', () => ({ createClient }))

const load = async () => {
  vi.resetModules()
  return import('@/lib/supabase')
}

describe('supabase browser client', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it('returns null when the public env vars are not set', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', '')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', '')
    const { getSupabase } = await load()
    expect(getSupabase()).toBeNull()
    expect(createClient).not.toHaveBeenCalled()
  })

  it('creates one client from the public url and anon key', async () => {
    vi.stubEnv('VITE_SUPABASE_URL', 'https://x.supabase.co')
    vi.stubEnv('VITE_SUPABASE_ANON_KEY', 'anon')
    const { getSupabase } = await load()
    expect(getSupabase()).toBe(getSupabase())
    expect(createClient).toHaveBeenCalledTimes(1)
    expect(createClient).toHaveBeenCalledWith('https://x.supabase.co', 'anon')
  })
})
