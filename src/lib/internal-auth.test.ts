import { createHmac } from 'node:crypto'

const store = new Map<string, string>()
jest.mock('next/headers', () => ({
  cookies: async () => ({ get: (name: string) => (store.has(name) ? { value: store.get(name) } : undefined) }),
}))

const original = process.env.INTERNAL_PASSWORD
const expected = (pw: string) => createHmac('sha256', pw).update('internal-session').digest('hex')

afterEach(() => {
  store.clear()
  if (original === undefined) delete process.env.INTERNAL_PASSWORD
  else process.env.INTERNAL_PASSWORD = original
})

describe('internal auth', () => {
  it('verifies the right password and rejects wrong ones', async () => {
    process.env.INTERNAL_PASSWORD = 'hunter2'
    const { verifyPassword } = await import('./internal-auth')
    expect(verifyPassword('hunter2')).toBe(true)
    expect(verifyPassword('hunter3')).toBe(false)
    expect(verifyPassword('')).toBe(false)
  })

  it('fails closed when INTERNAL_PASSWORD is unset or empty', async () => {
    const { verifyPassword, isAuthed, sessionToken } = await import('./internal-auth')
    for (const value of [undefined, '']) {
      if (value === undefined) delete process.env.INTERNAL_PASSWORD
      else process.env.INTERNAL_PASSWORD = value
      expect(verifyPassword('')).toBe(false)
      expect(verifyPassword('anything')).toBe(false)
      expect(sessionToken()).toBeNull()
      store.set('internal_session', 'anything')
      expect(await isAuthed()).toBe(false)
    }
  })

  it('derives the session token as an HMAC of the password', async () => {
    process.env.INTERNAL_PASSWORD = 'hunter2'
    const { sessionToken } = await import('./internal-auth')
    expect(sessionToken()).toBe(expected('hunter2'))
  })

  it('is authed only with the matching cookie', async () => {
    process.env.INTERNAL_PASSWORD = 'hunter2'
    const { isAuthed } = await import('./internal-auth')
    expect(await isAuthed()).toBe(false)
    store.set('internal_session', 'forged')
    expect(await isAuthed()).toBe(false)
    store.set('internal_session', expected('hunter2'))
    expect(await isAuthed()).toBe(true)
  })

  it('invalidates sessions when the password changes', async () => {
    process.env.INTERNAL_PASSWORD = 'hunter2'
    const { isAuthed } = await import('./internal-auth')
    store.set('internal_session', expected('hunter2'))
    process.env.INTERNAL_PASSWORD = 'rotated'
    expect(await isAuthed()).toBe(false)
  })
})
