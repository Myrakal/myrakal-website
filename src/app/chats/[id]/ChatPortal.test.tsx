import { render, screen, waitFor, within } from '@testing-library/react'

const ID = '3f1c2b4a-0000-4000-8000-000000000001'
const mockReplace = jest.fn()
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: ID }),
  useRouter: () => ({ replace: mockReplace }),
}))

import ChatPortal from './ChatPortal'

const fetchMock = jest.fn()
const realFetch = globalThis.fetch
globalThis.fetch = fetchMock

const detail = (status: string) => ({
  id: ID,
  status,
  createdAt: '2026-10-20T10:00:00.000Z',
  priceCents: 15000,
  paid: false,
  progress: { collected: 3, total: 20 },
  messages: [
    { id: 'm1', role: 'user', text: 'I need a knee replacement', createdAt: '2026-10-20T10:01:00.000Z' },
    { id: 'm2', role: 'assistant', text: 'What is your name?', createdAt: '2026-10-20T10:01:05.000Z' },
  ],
  comments: [],
})

const respond = (status: number, body: unknown) =>
  fetchMock.mockResolvedValue({ ok: status >= 200 && status < 300, status, json: async () => body })

afterEach(() => {
  fetchMock.mockReset()
  mockReplace.mockReset()
})

afterAll(() => {
  globalThis.fetch = realFetch
})

describe('ChatPortal', () => {
  it('loads the chat by its route id and shows the transcript', async () => {
    respond(200, detail('doctor_review'))
    render(<ChatPortal />)
    const log = await screen.findByRole('region', { name: 'Conversation' })
    expect(fetchMock).toHaveBeenCalledWith(`/api/chats/${ID}`, expect.anything())
    expect(within(log).getByText('I need a knee replacement')).toBeTruthy()
    expect(within(log).getByText('What is your name?')).toBeTruthy()
  })

  it('links back to the dashboard', async () => {
    respond(200, detail('booked'))
    render(<ChatPortal />)
    await screen.findByRole('region', { name: 'Conversation' })
    expect(screen.getByRole('link', { name: /your chats/i }).getAttribute('href')).toBe('/dashboard')
  })

  it('goes to log in when the session has expired', async () => {
    respond(401, { error: 'unauthorized' })
    render(<ChatPortal />)
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'))
  })

  it('puts the status banner above the back link and the conversation', async () => {
    respond(200, detail('doctor_review'))
    render(<ChatPortal />)
    const banner = await screen.findByRole('region', { name: 'Case status' })
    const back = screen.getByRole('link', { name: /your chats/i })
    const conversation = screen.getByRole('region', { name: 'Conversation' })
    expect(banner.compareDocumentPosition(back) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(banner.compareDocumentPosition(conversation) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
    expect(within(banner).getByText('With our doctors')).toBeTruthy()
  })
})
