import { vi } from 'vitest'

const PrismaPg = vi.fn()
const PrismaClient = vi.fn()
vi.mock('@prisma/adapter-pg', () => ({ PrismaPg }))
vi.mock('../generated/prisma/client.ts', () => ({ PrismaClient }))

const load = async () => {
  vi.resetModules()
  return import('./db')
}

describe('createDb', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.clearAllMocks()
  })

  it('throws a clear error when DATABASE_URL is missing', async () => {
    vi.stubEnv('DATABASE_URL', '')
    const { createDb } = await load()
    expect(() => createDb()).toThrow(/DATABASE_URL/)
  })

  it('connects through the pg adapter using DATABASE_URL', async () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://u:p@host:6543/postgres?pgbouncer=true')
    const { createDb } = await load()
    createDb()
    expect(PrismaPg).toHaveBeenCalledWith({ connectionString: 'postgresql://u:p@host:6543/postgres?pgbouncer=true' })
    expect(PrismaClient).toHaveBeenCalledWith({ adapter: expect.any(Object) })
  })

  it('reuses one client across calls to db()', async () => {
    vi.stubEnv('DATABASE_URL', 'postgresql://u:p@host:5432/postgres')
    const { db } = await load()
    expect(db()).toBe(db())
    expect(PrismaClient).toHaveBeenCalledTimes(1)
  })
})
