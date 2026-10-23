import { render, screen } from '@testing-library/react'

import { PlanViewer } from './PlanViewer'

const fetchMock = jest.fn()
const realFetch = globalThis.fetch
globalThis.fetch = fetchMock

const respond = (status: number, body: unknown = {}) =>
  fetchMock.mockResolvedValue({ ok: status >= 200 && status < 300, status, json: async () => body })

afterEach(() => fetchMock.mockReset())
afterAll(() => {
  globalThis.fetch = realFetch
})

describe('PlanViewer', () => {
  it('requests the signed plan url for the chat', async () => {
    respond(200, { url: 'https://files.test/plan.pdf?sig=1' })
    render(<PlanViewer chatId="c1" />)
    await screen.findByTitle('Your plan')
    expect(fetchMock).toHaveBeenCalledWith('/api/chats/c1/plan', expect.anything())
  })

  it('embeds the PDF inline and offers a download link', async () => {
    respond(200, { url: 'https://files.test/plan.pdf?sig=1' })
    render(<PlanViewer chatId="c1" />)
    const frame = await screen.findByTitle('Your plan')
    expect(frame.getAttribute('src')).toBe('https://files.test/plan.pdf?sig=1')
    const link = screen.getByRole('link', { name: /download/i })
    expect(link.getAttribute('href')).toBe('https://files.test/plan.pdf?sig=1')
    expect(link.hasAttribute('download')).toBe(true)
  })

  it('shows a loading state first', () => {
    fetchMock.mockReturnValue(new Promise(() => {}))
    render(<PlanViewer chatId="c1" />)
    expect(screen.getByRole('status').textContent).toMatch(/loading your plan/i)
  })

  it('shows a calm message when the plan is not available', async () => {
    respond(404)
    render(<PlanViewer chatId="c1" />)
    expect(await screen.findByText(/not available/i)).toBeTruthy()
    expect(screen.queryByTitle('Your plan')).toBeNull()
  })

  it('shows an alert when loading fails', async () => {
    fetchMock.mockRejectedValue(new Error('boom'))
    render(<PlanViewer chatId="c1" />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not load your plan/i)
  })

  it('shows an alert for a malformed response', async () => {
    respond(200, {})
    render(<PlanViewer chatId="c1" />)
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not load your plan/i)
  })
})
