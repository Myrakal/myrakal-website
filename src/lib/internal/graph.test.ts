import { loadGraph } from './graph'

const mockFrom = jest.fn()
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({ from: (t: string) => mockFrom(t) })),
}))

const setEnv = () => {
  process.env.SUPABASE_URL = 'http://localhost'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'key'
}

beforeEach(() => {
  mockFrom.mockReset()
  delete process.env.SUPABASE_URL
  delete process.env.SUPABASE_SERVICE_ROLE_KEY
})

test('throws when env is missing', async () => {
  await expect(loadGraph()).rejects.toThrow('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set')
  expect(mockFrom).not.toHaveBeenCalled()
})

test('returns all five tables', async () => {
  setEnv()
  mockFrom.mockImplementation((t: string) => ({
    select: () => ({ range: async () => ({ data: [{ id: t }], error: null }) }),
  }))
  const graph = await loadGraph()
  expect(Object.keys(graph).sort()).toEqual(['affiliations', 'doctors', 'prices', 'procedures', 'providers'])
  expect(graph.providers).toEqual([{ id: 'providers' }])
})

test('treats null data as an empty table', async () => {
  setEnv()
  mockFrom.mockImplementation(() => ({ select: () => ({ range: async () => ({ data: null, error: null }) }) }))
  const graph = await loadGraph()
  expect(graph.doctors).toEqual([])
})

test('names the table in a query error', async () => {
  setEnv()
  mockFrom.mockImplementation((t: string) => ({
    select: () => ({
      range: async () => (t === 'prices' ? { data: null, error: { message: 'boom' } } : { data: [], error: null }),
    }),
  }))
  await expect(loadGraph()).rejects.toThrow('prices: boom')
})

test('pages through tables larger than one page', async () => {
  setEnv()
  const page = (n: number) => Array.from({ length: n }, (_, i) => ({ id: String(i) }))
  const ranges: number[][] = []
  mockFrom.mockImplementation((t: string) => ({
    select: () => ({
      range: async (from: number, to: number) => {
        if (t === 'prices') ranges.push([from, to])
        const data = t === 'prices' ? (from === 0 ? page(1000) : page(5)) : []
        return { data, error: null }
      },
    }),
  }))
  const graph = await loadGraph()
  expect(graph.prices).toHaveLength(1005)
  expect(ranges).toEqual([[0, 999], [1000, 1999]])
})
