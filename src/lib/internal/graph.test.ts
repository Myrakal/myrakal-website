import { loadGraph } from './graph'

const mockFrom = jest.fn()
jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({ from: (t: string) => mockFrom(t) })),
}))

const setEnv = () => {
  process.env.KNOWLEDGE_URL = 'http://localhost'
  process.env.KNOWLEDGE_SERVICE_KEY = 'key'
}

beforeEach(() => {
  mockFrom.mockReset()
  delete process.env.KNOWLEDGE_URL
  delete process.env.KNOWLEDGE_SERVICE_KEY
})

test('throws when env is missing', async () => {
  await expect(loadGraph()).rejects.toThrow('KNOWLEDGE_URL and KNOWLEDGE_SERVICE_KEY must be set')
  expect(mockFrom).not.toHaveBeenCalled()
})

const orderFn = jest.fn()

const withRange = (rangeFn: (from: number, to: number) => Promise<unknown>) => {
  orderFn.mockReturnValue({ range: rangeFn })
  return { select: () => ({ order: orderFn }) }
}
const ok = (data: unknown[] | null) => async () => ({ data, error: null })

test('returns all five tables', async () => {
  setEnv()
  mockFrom.mockImplementation((t: string) => withRange(async (from: number) => ({ data: from === 0 ? [{ id: t }] : [], error: null })))
  const graph = await loadGraph()
  expect(Object.keys(graph).sort()).toEqual(['affiliations', 'doctors', 'prices', 'procedures', 'providers'])
  expect(graph.providers).toEqual([{ id: 'providers' }])
})

test('treats null data as an empty table', async () => {
  setEnv()
  mockFrom.mockImplementation(() => withRange(ok(null)))
  const graph = await loadGraph()
  expect(graph.doctors).toEqual([])
})

test('names the table in a query error', async () => {
  setEnv()
  mockFrom.mockImplementation((t: string) =>
    withRange(async () => (t === 'prices' ? { data: null, error: { message: 'boom' } } : { data: [], error: null })),
  )
  await expect(loadGraph()).rejects.toThrow('prices: boom')
})

test('orders by id before ranging', async () => {
  setEnv()
  mockFrom.mockImplementation(() => withRange(ok([])))
  await loadGraph()
  expect(orderFn).toHaveBeenCalledWith('id')
})

test('keeps paging past a short page until an empty one', async () => {
  setEnv()
  const ranges: number[][] = []
  const pages = [[{ id: 'a' }, { id: 'b' }], [{ id: 'c' }], []]
  mockFrom.mockImplementation((t: string) =>
    withRange(async (from: number, to: number) => {
      if (t !== 'prices') return { data: [], error: null }
      ranges.push([from, to])
      return { data: pages.shift() ?? [], error: null }
    }),
  )
  const graph = await loadGraph()
  expect(graph.prices).toEqual([{ id: 'a' }, { id: 'b' }, { id: 'c' }])
  expect(ranges).toEqual([[0, 999], [1000, 1999], [2000, 2999]])
})
