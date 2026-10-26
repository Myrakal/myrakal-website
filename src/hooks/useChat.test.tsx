import { act, renderHook, waitFor } from '@testing-library/react'

const mockReplace = jest.fn()
const mockRouter = { replace: mockReplace, push: jest.fn() }
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
}))

import { useChat } from '@/hooks/useChat'

const ID = '3f1c2b4a-0000-4000-8000-000000000001'
const fetchMock = jest.fn()
const realFetch = globalThis.fetch
globalThis.fetch = fetchMock

const reply = (status: number, body: unknown) => ({ ok: status >= 200 && status < 300, status, json: async () => body })

const route = (handlers: Record<string, () => unknown>) =>
  fetchMock.mockImplementation(async (url: string, init?: { method?: string }) => {
    const handler = handlers[`${init?.method ?? 'GET'} ${url}`]
    if (!handler) throw new Error(`unexpected ${init?.method ?? 'GET'} ${url}`)
    return handler()
  })

afterEach(() => {
  fetchMock.mockReset()
  mockReplace.mockReset()
})

afterAll(() => {
  globalThis.fetch = realFetch
})

describe('useChat', () => {
  it('stays idle with no chat id', () => {
    const { result } = renderHook(() => useChat(null))
    expect(result.current.loading).toBe(false)
    expect(result.current.messages).toEqual([])
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('loads an existing chat', async () => {
    route({
      [`GET /api/chats/${ID}`]: () =>
        reply(200, { status: 'intake', progress: { collected: 2, total: 20 }, messages: [{ id: 'm1', role: 'user', text: 'hi' }] }),
    })
    const { result } = renderHook(() => useChat(ID))
    expect(result.current.loading).toBe(true)
    await waitFor(() => expect(result.current.loading).toBe(false))
    expect(result.current.messages).toHaveLength(1)
    expect(result.current.progress).toEqual({ collected: 2, total: 20 })
  })

  it('reports a non-intake status on load through the callback', async () => {
    route({ [`GET /api/chats/${ID}`]: () => reply(200, { status: 'submitted', progress: { collected: 20, total: 20 }, messages: [] }) })
    const onStatusChange = jest.fn()
    renderHook(() => useChat(ID, { onStatusChange }))
    await waitFor(() => expect(onStatusChange).toHaveBeenCalledWith('submitted', ID, true))
  })

  it('creates the chat on first send and reports it', async () => {
    route({
      'POST /api/chats': () => reply(201, { id: ID }),
      [`POST /api/chats/${ID}/messages`]: () =>
        reply(200, { reply: { id: 'a1', role: 'assistant', text: 'Name?' }, status: 'intake', progress: { collected: 1, total: 20 } }),
    })
    const onCreated = jest.fn()
    const { result } = renderHook(() => useChat(null, { onCreated }))
    await act(async () => {
      await result.current.send('hello')
    })
    expect(onCreated).toHaveBeenCalledWith(ID)
    expect(result.current.messages.map((m) => m.text)).toEqual(['hello', 'Name?'])
    expect(result.current.status).toBe('intake')
  })

  it('redirects to login on 401 and drops the pending message', async () => {
    route({
      'POST /api/chats': () => reply(201, { id: ID }),
      [`POST /api/chats/${ID}/messages`]: () => reply(401, {}),
    })
    const { result } = renderHook(() => useChat(null))
    await act(async () => {
      await result.current.send('hello')
    })
    expect(mockReplace).toHaveBeenCalledWith('/login')
    expect(result.current.messages).toEqual([])
  })

  it('calls onLocked on 409 and drops the pending message', async () => {
    route({
      [`GET /api/chats/${ID}`]: () => reply(200, { status: 'intake', progress: { collected: 1, total: 20 }, messages: [] }),
      [`POST /api/chats/${ID}/messages`]: () => reply(409, {}),
    })
    const onLocked = jest.fn()
    const { result } = renderHook(() => useChat(ID, { onLocked }))
    await act(async () => {
      await result.current.send('hello')
    })
    expect(onLocked).toHaveBeenCalledWith(ID)
    expect(result.current.messages).toEqual([])
  })

  it('shows the rate limit error', async () => {
    route({ 'POST /api/chats': () => reply(429, {}) })
    const { result } = renderHook(() => useChat(null))
    let ok = true
    await act(async () => {
      ok = await result.current.send('hello')
    })
    expect(ok).toBe(false)
    expect(result.current.error).toMatch(/limit/)
  })
})
