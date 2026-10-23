import { render, screen, waitFor } from '@testing-library/react'

import { ChatList } from '@/components/portal/ChatList'

const chats = [
  { id: 'a1', status: 'intake', createdAt: '2026-10-20T10:00:00.000Z', summary: null },
  { id: 'b2', status: 'plan_ready', createdAt: '2026-10-18T10:00:00.000Z', summary: 'Knee replacement in Spain' },
  { id: 'c3', status: 'booked', createdAt: '2026-10-01T10:00:00.000Z', summary: 'Dental implants' },
]

const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ replace: mockReplace }) }))

const fetchMock = jest.fn()
globalThis.fetch = fetchMock

const respond = (status: number, body: unknown) => {
  fetchMock.mockResolvedValue({ ok: status >= 200 && status < 300, status, json: async () => body })
  return fetchMock
}

afterEach(() => {
  fetchMock.mockReset()
  mockReplace.mockReset()
})

describe('ChatList', () => {
  it('lists the caller chats with a status badge and a link each', async () => {
    const fetchSpy = respond(200, chats)
    render(<ChatList />)
    expect(await screen.findByText('Knee replacement in Spain')).toBeTruthy()
    expect(fetchSpy).toHaveBeenCalledWith('/api/chats', expect.anything())
    expect(screen.getByText('Plan ready')).toBeTruthy()
    expect(screen.getByText('Booked')).toBeTruthy()
    expect(screen.getByRole('link', { name: /Knee replacement in Spain/ }).getAttribute('href')).toBe('/chats/b2')
  })

  it('resumes an unfinished intake in the chat page', async () => {
    respond(200, chats)
    render(<ChatList />)
    const link = await screen.findByRole('link', { name: /New conversation/ })
    expect(link.getAttribute('href')).toBe('/chat?id=a1')
    expect(screen.getByText('In conversation')).toBeTruthy()
  })

  it('always offers a new chat', async () => {
    respond(200, chats)
    render(<ChatList />)
    expect((await screen.findByRole('link', { name: 'New chat' })).getAttribute('href')).toBe('/chat')
  })

  it('starts a chat and opens it for someone with no chats yet', async () => {
    fetchMock.mockImplementation(async (_url: string, init?: { method?: string }) =>
      init?.method === 'POST'
        ? { ok: true, status: 201, json: async () => ({ id: 'new-chat-id' }) }
        : { ok: true, status: 200, json: async () => [] },
    )
    render(<ChatList />)
    expect(await screen.findByText(/starting your chat/i)).toBeTruthy()
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/chat?id=new-chat-id'))
    const posts = fetchMock.mock.calls.filter(([, init]) => init?.method === 'POST')
    expect(posts).toHaveLength(1)
    expect(posts[0][0]).toBe('/api/chats')
  })

  it('does not create a chat for someone who already has chats', async () => {
    const fetchSpy = respond(200, chats)
    render(<ChatList />)
    await screen.findByText('Knee replacement in Spain')
    expect(fetchSpy.mock.calls.filter(([, init]) => init?.method === 'POST')).toHaveLength(0)
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('falls back to the empty state when the new chat cannot be created', async () => {
    fetchMock.mockImplementation(async (_url: string, init?: { method?: string }) =>
      init?.method === 'POST'
        ? { ok: false, status: 429, json: async () => ({}) }
        : { ok: true, status: 200, json: async () => [] },
    )
    render(<ChatList />)
    expect(await screen.findByText(/no chats yet/i)).toBeTruthy()
    expect(screen.getByRole('link', { name: 'New chat' })).toBeTruthy()
    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('shows an error when the request fails', async () => {
    respond(500, { error: 'boom' })
    render(<ChatList />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not load/i)
  })

  it('shows an error when the network is down', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    render(<ChatList />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not load/i)
  })

  it('shows an error when the body is not a list', async () => {
    respond(200, { error: 'nope' })
    render(<ChatList />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not load/i)
  })

  it('titles finished chats without a summary as your case', async () => {
    respond(200, [{ id: 'z9', status: 'booked', createdAt: '2026-10-01T10:00:00.000Z', summary: '' }])
    render(<ChatList />)
    expect(await screen.findByText('Your case')).toBeTruthy()
  })

  it('goes to log in when the session has expired', async () => {
    respond(401, { error: 'unauthorized' })
    render(<ChatList />)
    await screen.findByRole('status')
    expect(mockReplace).toHaveBeenCalledWith('/login')
  })
})
