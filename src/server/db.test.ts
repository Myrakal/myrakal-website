
const mockPrismaPg = jest.fn()
const mockPrismaClient = jest.fn()
jest.mock('@prisma/adapter-pg', () => ({ PrismaPg: mockPrismaPg }))
jest.mock('../../generated/prisma/client.ts', () => ({ PrismaClient: mockPrismaClient }))

const load = async () => {
  jest.resetModules()
  return import('./db')
}

const originalEnv = { ...process.env }

describe('createDb', () => {
  afterEach(() => {
    process.env = { ...originalEnv }
    jest.clearAllMocks()
  })

  it('throws a clear error when DATABASE_URL is missing', async () => {
    process.env['DATABASE_URL'] = ''
    const { createDb } = await load()
    expect(() => createDb()).toThrow(/DATABASE_URL/)
  })

  it('connects through the pg adapter using DATABASE_URL', async () => {
    process.env['DATABASE_URL'] = 'postgresql://u:p@host:6543/postgres?pgbouncer=true'
    const { createDb } = await load()
    createDb()
    expect(mockPrismaPg).toHaveBeenCalledWith({ connectionString: 'postgresql://u:p@host:6543/postgres?pgbouncer=true' })
    expect(mockPrismaClient).toHaveBeenCalledWith({ adapter: expect.any(Object) })
  })

  it('reuses one client across calls to db()', async () => {
    process.env['DATABASE_URL'] = 'postgresql://u:p@host:5432/postgres'
    const { db } = await load()
    expect(db()).toBe(db())
    expect(mockPrismaClient).toHaveBeenCalledTimes(1)
  })
})
