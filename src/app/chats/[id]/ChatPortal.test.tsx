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

const copy = [
  ['intake', /conversation is not finished/i],
  ['doctor_review', /A doctor will review your transcript\. Your plan will be emailed to you\./],
  ['plan_ready', /Your plan is ready/],
  ['clarification_review', /Your comments are being reviewed\. We will email you the updated plan\./],
  ['awaiting_payment', /Payment is the next step/],
  ['reservations', /Reservations are being made\. We will reach out once they are done\./],
  ['booked', /We have emailed you everything\./],
] as const

const planStatuses = ['plan_ready', 'clarification_review', 'awaiting_payment', 'reservations', 'booked']
const noPlanStatuses = ['intake', 'doctor_review']

describe('ChatPortal plan viewer', () => {
  beforeEach(() => {
    fetchMock.mockImplementation(async (url: string) =>
      url.endsWith('/plan')
        ? { ok: true, status: 200, json: async () => ({ url: 'https://files.test/plan.pdf' }) }
        : { ok: true, status: 200, json: async () => detail(currentStatus) },
    )
  })
  let currentStatus = 'plan_ready'

  it.each(planStatuses)('shows the plan in %s', async (status) => {
    currentStatus = status
    render(<ChatPortal />)
    expect(await screen.findByTitle('Your plan')).toBeTruthy()
  })

  it.each(noPlanStatuses)('does not request the plan in %s', async (status) => {
    currentStatus = status
    render(<ChatPortal />)
    await screen.findByRole('log', { name: 'Conversation' })
    expect(fetchMock.mock.calls.some(([url]) => String(url).endsWith('/plan'))).toBe(false)
  })
})

describe('ChatPortal', () => {
  it.each(copy)('shows the %s status message', async (status, text) => {
    respond(200, detail(status))
    render(<ChatPortal />)
    expect((await screen.findByRole('region', { name: 'Case status' })).textContent).toMatch(text)
  })

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

  it('offers to continue an unfinished intake', async () => {
    respond(200, detail('intake'))
    render(<ChatPortal />)
    expect((await screen.findByRole('link', { name: 'Continue your conversation' })).getAttribute('href')).toBe(`/chat?id=${ID}`)
  })

  it('falls back to a generic message for an unknown status', async () => {
    respond(200, detail('some_future_status'))
    render(<ChatPortal />)
    expect((await screen.findByRole('region', { name: 'Case status' })).textContent).toMatch(/working on your case/i)
  })

  it('shows a load error when a 500 has a non-JSON body', async () => {
    fetchMock.mockResolvedValue({ ok: false, status: 500, json: async () => { throw new SyntaxError() } })
    render(<ChatPortal />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not load/i)
  })

  it('shows a loading note first', () => {
    fetchMock.mockReturnValue(new Promise(() => {}))
    render(<ChatPortal />)
    expect(screen.getByRole('status').textContent).toMatch(/loading/i)
  })

  it('goes to log in when the session has expired', async () => {
    respond(401, { error: 'unauthorized' })
    render(<ChatPortal />)
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith('/login'))
  })

  it('says the case was not found on 404', async () => {
    respond(404, { error: 'not found' })
    render(<ChatPortal />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not find/i)
  })

  it('shows a load error on server failure or a bad body', async () => {
    respond(500, {})
    const first = render(<ChatPortal />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not load/i)
    first.unmount()
    respond(200, { nope: true })
    render(<ChatPortal />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not load/i)
  })

  it('shows a load error when the network is down', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    render(<ChatPortal />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not load/i)
  })
})
