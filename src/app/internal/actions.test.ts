const set = jest.fn()
const redirect = jest.fn((_path: string) => {
  throw new Error('NEXT_REDIRECT')
})
jest.mock('next/headers', () => ({ cookies: async () => ({ set }) }))
jest.mock('next/navigation', () => ({ redirect: (path: string) => redirect(path) }))

const original = process.env.INTERNAL_PASSWORD
const form = (password: string) => {
  const data = new FormData()
  data.set('password', password)
  return data
}

beforeEach(() => {
  set.mockClear()
  redirect.mockClear()
  process.env.INTERNAL_PASSWORD = 'hunter2'
})

afterEach(() => {
  if (original === undefined) delete process.env.INTERNAL_PASSWORD
  else process.env.INTERNAL_PASSWORD = original
})

describe('login action', () => {
  it('rejects a wrong password without setting a cookie', async () => {
    const { login } = await import('./actions')
    expect(await login({}, form('nope'))).toEqual({ error: 'Incorrect password' })
    expect(set).not.toHaveBeenCalled()
  })

  it('rejects everything when INTERNAL_PASSWORD is unset', async () => {
    delete process.env.INTERNAL_PASSWORD
    const { login } = await import('./actions')
    expect(await login({}, form(''))).toEqual({ error: 'Incorrect password' })
    expect(await login({}, form('undefined'))).toEqual({ error: 'Incorrect password' })
    expect(set).not.toHaveBeenCalled()
  })

  it('sets a locked-down session cookie on the right password', async () => {
    const { login } = await import('./actions')
    await expect(login({}, form('hunter2'))).rejects.toThrow('NEXT_REDIRECT')
    expect(set).toHaveBeenCalledWith(
      'internal_session',
      expect.stringMatching(/^[0-9a-f]{64}$/),
      expect.objectContaining({ httpOnly: true, sameSite: 'strict', path: '/internal', maxAge: 43200 }),
    )
    expect(redirect).toHaveBeenCalledWith('/internal')
  })

  it('marks the cookie secure in production only', async () => {
    const env = process.env as Record<string, string | undefined>
    const nodeEnv = env.NODE_ENV
    const { login } = await import('./actions')
    env.NODE_ENV = 'production'
    await expect(login({}, form('hunter2'))).rejects.toThrow()
    expect(set.mock.calls[0][2].secure).toBe(true)
    set.mockClear()
    env.NODE_ENV = 'test'
    await expect(login({}, form('hunter2'))).rejects.toThrow()
    expect(set.mock.calls[0][2].secure).toBe(false)
    env.NODE_ENV = nodeEnv
  })

  it('logout expires the cookie on the same path', async () => {
    const { logout } = await import('./actions')
    await expect(logout()).rejects.toThrow('NEXT_REDIRECT')
    expect(set).toHaveBeenCalledWith('internal_session', '', expect.objectContaining({ path: '/internal', maxAge: 0 }))
  })
})
