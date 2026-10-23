import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockReplace = jest.fn()
const mockPush = jest.fn()
let mockParams = new URLSearchParams()
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
  useSearchParams: () => mockParams,
}))

import Chat from '@/views/Chat'

const ID = '3f1c2b4a-0000-4000-8000-000000000001'
const fetchMock = jest.fn()
const realFetch = globalThis.fetch
globalThis.fetch = fetchMock

const reply = (status: number, body: unknown) => ({ ok: status >= 200 && status < 300, status, json: async () => body })

const detail = (over = {}) => ({
  id: ID,
  status: 'intake',
  createdAt: '2026-10-20T10:00:00.000Z',
  priceCents: null,
  paid: false,
  progress: { collected: 4, total: 20 },
  messages: [
    { id: 'm1', role: 'user', text: 'I need a knee replacement', createdAt: '2026-10-20T10:01:00.000Z' },
    { id: 'm2', role: 'assistant', text: 'What is your name?', createdAt: '2026-10-20T10:01:05.000Z' },
  ],
  comments: [],
  ...over,
})

const route = (handlers: Record<string, () => unknown>) =>
  fetchMock.mockImplementation(async (url: string, init?: { method?: string }) => {
    const handler = handlers[`${init?.method ?? 'GET'} ${url}`]
    if (!handler) throw new Error(`unexpected ${init?.method ?? 'GET'} ${url}`)
    return handler()
  })

const sendMessage = async (text: string) => {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Message'), text)
  await user.click(screen.getByRole('button', { name: 'Send message' }))
}

const messageCall = () => fetchMock.mock.calls.find(([url]) => url === `/api/chats/${ID}/messages`)

const scrollIntoView = jest.fn()

beforeEach(() => {
  mockParams = new URLSearchParams()
  Element.prototype.scrollIntoView = scrollIntoView
})

afterEach(() => {
  scrollIntoView.mockReset()
  fetchMock.mockReset()
  mockReplace.mockReset()
  mockPush.mockReset()
})

afterAll(() => {
  globalThis.fetch = realFetch
})

describe('Chat', () => {
  it('greets a new visitor without creating a chat or showing progress', () => {
    render(<Chat />)
    expect(screen.getByText(/welcome to Myrakal/i)).toBeTruthy()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.queryByRole('progressbar')).toBeNull()
  })

  it('creates the chat on the first message, posts it and shows the reply and progress', async () => {
    route({
      'POST /api/chats': () => reply(201, { id: ID }),
      [`POST /api/chats/${ID}/messages`]: () =>
        reply(200, {
          reply: { id: 'r1', role: 'assistant', text: 'Thanks. What is your date of birth?', createdAt: '2026-10-20T10:02:00.000Z' },
          status: 'intake',
          progress: { collected: 1, total: 20 },
        }),
    })
    render(<Chat />)
    await sendMessage('Hello, I am Sam')
    expect(await screen.findByText('Thanks. What is your date of birth?')).toBeTruthy()
    expect(screen.getByText('Hello, I am Sam')).toBeTruthy()
    expect(JSON.parse(messageCall()![1].body)).toEqual({ text: 'Hello, I am Sam' })
    const bar = screen.getByRole('progressbar')
    expect(bar.getAttribute('aria-valuenow')).toBe('1')
    expect(bar.getAttribute('aria-valuemax')).toBe('20')
    expect(fetchMock.mock.calls.filter(([url]) => url === '/api/chats')).toHaveLength(1)
  })

  it('reuses the chat for later messages', async () => {
    route({
      'POST /api/chats': () => reply(201, { id: ID }),
      [`POST /api/chats/${ID}/messages`]: () =>
        reply(200, { reply: { id: 'r', role: 'assistant', text: 'ok', createdAt: '2026-10-20T10:02:00.000Z' }, status: 'intake', progress: { collected: 1, total: 20 } }),
    })
    render(<Chat />)
    await sendMessage('one')
    await screen.findByText('ok')
    await sendMessage('two')
    await waitFor(() => expect(fetchMock.mock.calls.filter(([url]) => url === `/api/chats/${ID}/messages`)).toHaveLength(2))
    expect(fetchMock.mock.calls.filter(([url]) => url === '/api/chats')).toHaveLength(1)
  })

  it('restores the transcript and progress from the server on reload', async () => {
    mockParams = new URLSearchParams({ id: ID })
    route({ [`GET /api/chats/${ID}`]: () => reply(200, detail()) })
    render(<Chat />)
    expect(await screen.findByText('What is your name?')).toBeTruthy()
    expect(screen.getByText('I need a knee replacement')).toBeTruthy()
    expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('4')
  })

  it('sends a chat that is past intake to its portal page', async () => {
    mockParams = new URLSearchParams({ id: ID })
    route({ [`GET /api/chats/${ID}`]: () => reply(200, detail({ status: 'doctor_review' })) })
    render(<Chat />)
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith(`/chats/${ID}`))
  })

  it('redirects to the portal page when the reply completes the intake', async () => {
    mockParams = new URLSearchParams({ id: ID })
    route({
      [`GET /api/chats/${ID}`]: () => reply(200, detail()),
      [`POST /api/chats/${ID}/messages`]: () =>
        reply(200, { reply: { id: 'r', role: 'assistant', text: 'All set.', createdAt: '2026-10-20T10:02:00.000Z' }, status: 'doctor_review', progress: { collected: 20, total: 20 } }),
    })
    render(<Chat />)
    await screen.findByText('What is your name?')
    await sendMessage('Sam')
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith(`/chats/${ID}`))
  })

  it('goes to the portal page on a 409 from the messages route', async () => {
    mockParams = new URLSearchParams({ id: ID })
    route({
      [`GET /api/chats/${ID}`]: () => reply(200, detail()),
      [`POST /api/chats/${ID}/messages`]: () => reply(409, { error: 'conflict' }),
    })
    render(<Chat />)
    await screen.findByText('What is your name?')
    await sendMessage('Sam')
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith(`/chats/${ID}`))
  })

  it('shows an error and drops the unsent message when sending fails', async () => {
    mockParams = new URLSearchParams({ id: ID })
    route({
      [`GET /api/chats/${ID}`]: () => reply(200, detail()),
      [`POST /api/chats/${ID}/messages`]: () => reply(500, { error: 'boom' }),
    })
    render(<Chat />)
    await screen.findByText('What is your name?')
    await sendMessage('Sam')
    expect((await screen.findByRole('alert')).textContent).toMatch(/not sent/i)
    expect(within(screen.getByRole('log')).queryByText('Sam')).toBeNull()
  })

  it('explains the limit when the server answers 429', async () => {
    route({ 'POST /api/chats': () => reply(429, { error: 'too many chats' }) })
    render(<Chat />)
    await sendMessage('Hello')
    expect((await screen.findByRole('alert')).textContent).toMatch(/reached the limit/i)
  })

  it('goes to log in when the session has expired', async () => {
    mockParams = new URLSearchParams({ id: ID })
    route({ [`GET /api/chats/${ID}`]: () => reply(401, { error: 'unauthorized' }) })
    render(<Chat />)
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'))
  })

  it('keeps the typed text in the composer when sending fails', async () => {
    mockParams = new URLSearchParams({ id: ID })
    route({
      [`GET /api/chats/${ID}`]: () => reply(200, detail()),
      [`POST /api/chats/${ID}/messages`]: () => reply(500, { error: 'boom' }),
    })
    render(<Chat />)
    await screen.findByText('What is your name?')
    await sendMessage('A long medical history')
    await screen.findByRole('alert')
    expect((screen.getByLabelText('Message') as HTMLTextAreaElement).value).toBe('A long medical history')
  })

  it('does not leave an undelivered message in the transcript on 409', async () => {
    mockParams = new URLSearchParams({ id: ID })
    route({
      [`GET /api/chats/${ID}`]: () => reply(200, detail()),
      [`POST /api/chats/${ID}/messages`]: () => reply(409, { error: 'conflict' }),
    })
    render(<Chat />)
    await screen.findByText('What is your name?')
    await sendMessage('Sam')
    await waitFor(() => expect(mockPush).toHaveBeenCalled())
    expect(within(screen.getByRole('log')).queryByText('Sam')).toBeNull()
  })

  it('shows a loading note while restoring and ignores a malformed id', async () => {
    mockParams = new URLSearchParams({ id: '../other' })
    render(<Chat />)
    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.queryByText(/loading your conversation/i)).toBeNull()
  })

  it('blocks sending when the chat could not be loaded', async () => {
    mockParams = new URLSearchParams({ id: ID })
    route({ [`GET /api/chats/${ID}`]: () => reply(500, {}) })
    render(<Chat />)
    await screen.findByRole('alert')
    await userEvent.setup().type(screen.getByLabelText('Message'), 'hi')
    expect((screen.getByRole('button', { name: 'Send message' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('shows an error for a chat that cannot be loaded', async () => {
    mockParams = new URLSearchParams({ id: ID })
    route({ [`GET /api/chats/${ID}`]: () => reply(404, { error: 'not found' }) })
    render(<Chat />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not load/i)
  })

  it('clears the text field as soon as a message is sent', async () => {
    let finish: (value: unknown) => void = () => {}
    route({
      'POST /api/chats': () => reply(201, { id: ID }),
      [`POST /api/chats/${ID}/messages`]: () => new Promise((resolve) => (finish = resolve)),
    })
    render(<Chat />)
    await sendMessage('Hello there')
    expect((screen.getByLabelText('Message') as HTMLTextAreaElement).value).toBe('')
    finish(reply(200, { reply: { id: 'r', role: 'assistant', text: 'Hi', createdAt: '2026-10-20T10:02:00.000Z' }, status: 'intake', progress: { collected: 1, total: 20 } }))
    expect(await screen.findByText('Hi')).toBeTruthy()
  })

  it('scrolls to the latest message when a chat is opened', async () => {
    mockParams = new URLSearchParams({ id: ID })
    route({ [`GET /api/chats/${ID}`]: () => reply(200, detail()) })
    render(<Chat />)
    await screen.findByText('What is your name?')
    await waitFor(() => expect(scrollIntoView).toHaveBeenCalledWith(expect.objectContaining({ block: 'end' })))
  })

  it('scrolls down again when the assistant replies', async () => {
    route({
      'POST /api/chats': () => reply(201, { id: ID }),
      [`POST /api/chats/${ID}/messages`]: () =>
        reply(200, { reply: { id: 'r1', role: 'assistant', text: 'A reply', createdAt: '2026-10-20T10:02:00.000Z' }, status: 'intake', progress: { collected: 1, total: 20 } }),
    })
    render(<Chat />)
    await sendMessage('Hello')
    await screen.findByText('A reply')
    const before = scrollIntoView.mock.calls.length
    await sendMessage('Another')
    await waitFor(() => expect(scrollIntoView.mock.calls.length).toBeGreaterThan(before))
    expect(scrollIntoView).toHaveBeenLastCalledWith(expect.objectContaining({ block: 'end', behavior: 'smooth' }))
  })

  it('jumps without animation when a chat is first opened', async () => {
    mockParams = new URLSearchParams({ id: ID })
    route({ [`GET /api/chats/${ID}`]: () => reply(200, detail()) })
    render(<Chat />)
    await screen.findByText('What is your name?')
    expect(scrollIntoView).toHaveBeenLastCalledWith(expect.objectContaining({ behavior: 'auto' }))
  })

  it('reserves room below the last message for the composer', () => {
    const { container } = render(<Chat />)
    const end = container.querySelector('[role="log"] > div:last-child') as HTMLElement
    expect(end.style.scrollMarginBottom).toMatch(/px$/)
  })

  it('keeps what was typed while a failed send comes back, instead of overwriting it', async () => {
    let fail: (value: unknown) => void = () => {}
    mockParams = new URLSearchParams({ id: ID })
    route({
      [`GET /api/chats/${ID}`]: () => reply(200, detail()),
      [`POST /api/chats/${ID}/messages`]: () => new Promise((resolve) => (fail = resolve)),
    })
    render(<Chat />)
    await screen.findByText('What is your name?')
    await sendMessage('First try')
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Message'), 'Second draft')
    fail(reply(500, { error: 'boom' }))
    await screen.findByRole('alert')
    expect((screen.getByLabelText('Message') as HTMLTextAreaElement).value).toBe('Second draft')
  })
})
