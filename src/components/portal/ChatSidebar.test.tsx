import { fireEvent, render, screen } from '@testing-library/react'

import { ChatSidebar } from '@/components/portal/ChatSidebar'

const chats = [
  { id: 'c3', status: 'booked', createdAt: '2026-10-01T10:00:00.000Z', summary: 'Dental implants' },
  { id: 'a1', status: 'intake', createdAt: '2026-10-20T10:00:00.000Z', summary: null },
  { id: 'b2', status: 'plan_ready', createdAt: '2026-10-18T10:00:00.000Z', summary: 'Knee replacement in Spain' },
]

const mockReplace = jest.fn()
const mockRouter = { replace: mockReplace }
jest.mock('next/navigation', () => ({ useRouter: () => mockRouter }))

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

describe('ChatSidebar', () => {
  it('lists chats newest first with summary, date, status and dashboard links', async () => {
    const fetchSpy = respond(200, chats)
    render(<ChatSidebar />)
    await screen.findByText('Knee replacement in Spain')
    expect(fetchSpy).toHaveBeenCalledWith('/api/chats', expect.anything())
    const links = screen.getAllByRole('link').filter((link) => link.getAttribute('href')?.startsWith('/dashboard/'))
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/dashboard/a1', '/dashboard/b2', '/dashboard/c3'])
    expect(screen.getByText('New conversation')).toBeTruthy()
    expect(screen.getByText('In conversation')).toBeTruthy()
    expect(screen.getByText('Plan ready')).toBeTruthy()
    expect(screen.getByText('Booked')).toBeTruthy()
    expect(document.querySelectorAll('time')).toHaveLength(3)
  })

  it('titles finished chats without a summary as your case', async () => {
    respond(200, [{ id: 'z9', status: 'booked', createdAt: '2026-10-01T10:00:00.000Z', summary: '' }])
    render(<ChatSidebar />)
    expect(await screen.findByText('Your case')).toBeTruthy()
  })

  it('marks only the active chat as the current page', async () => {
    respond(200, chats)
    render(<ChatSidebar activeId="b2" />)
    const active = await screen.findByRole('link', { name: /Knee replacement in Spain/ })
    expect(active.getAttribute('aria-current')).toBe('page')
    expect(screen.getByRole('link', { name: /Dental implants/ }).getAttribute('aria-current')).toBeNull()
  })

  it('offers a new chat', async () => {
    respond(200, chats)
    render(<ChatSidebar />)
    await screen.findByText('Dental implants')
    expect(screen.getByRole('link', { name: 'New chat' }).getAttribute('href')).toBe('/dashboard')
  })

  it('shows an empty state without redirecting', async () => {
    respond(200, [])
    render(<ChatSidebar />)
    expect(await screen.findByText(/no chats yet/i)).toBeTruthy()
    expect(mockReplace).not.toHaveBeenCalled()
    expect(screen.getByRole('link', { name: 'New chat' })).toBeTruthy()
  })

  it('shows an error when the request fails', async () => {
    respond(500, { error: 'boom' })
    render(<ChatSidebar />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not load/i)
  })

  it('shows an error when the network is down', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    render(<ChatSidebar />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not load/i)
  })

  it('shows an error when the body is not a list', async () => {
    respond(200, { error: 'nope' })
    render(<ChatSidebar />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not load/i)
  })

  it('goes to log in when the session has expired', async () => {
    respond(401, { error: 'unauthorized' })
    render(<ChatSidebar />)
    await screen.findByRole('status')
    expect(mockReplace).toHaveBeenCalledWith('/login')
  })

  it('collapses to a rail and expands again with an accessible toggle', async () => {
    respond(200, chats)
    render(<ChatSidebar />)
    await screen.findByText('Dental implants')
    const toggle = screen.getByRole('button', { name: /collapse/i })
    expect(toggle.getAttribute('aria-expanded')).toBe('true')
    fireEvent.click(toggle)
    const expand = screen.getByRole('button', { name: /expand/i })
    expect(expand.getAttribute('aria-expanded')).toBe('false')
    expect(screen.queryByText('Dental implants')).toBeNull()
    expect(screen.getByRole('link', { name: 'New chat' })).toBeTruthy()
    fireEvent.click(expand)
    expect(screen.getByText('Dental implants')).toBeTruthy()
  })

  it('hides the collapse toggle below lg', async () => {
    respond(200, chats)
    render(<ChatSidebar />)
    expect((await screen.findByRole('button', { name: 'Collapse chat list' })).className).toContain('max-lg:hidden')
  })
})
