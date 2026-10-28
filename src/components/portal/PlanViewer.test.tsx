import { act, render, screen } from '@testing-library/react'

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
  it('frames the preview with a hairline rule', async () => {
    respond(200, { url: 'https://signed.example/plan.pdf' })
    await act(async () => {
      render(<PlanViewer chatId="c1" />)
    })
    expect(screen.getByTitle('Plan PDF preview').className).toContain('border-rule')
  })

  it('requests the signed plan url for the chat', async () => {
    respond(200, { url: 'https://files.test/plan.pdf?sig=1' })
    render(<PlanViewer chatId="c1" />)
    await screen.findByTitle('Plan PDF preview')
    expect(fetchMock).toHaveBeenCalledWith('/api/chats/c1/plan', expect.anything())
  })

  it('embeds the PDF inline and offers a download link', async () => {
    respond(200, { url: 'https://files.test/plan.pdf?sig=1' })
    render(<PlanViewer chatId="c1" />)
    const frame = await screen.findByTitle('Plan PDF preview')
    expect(frame.getAttribute('src')).toBe('https://files.test/plan.pdf?sig=1')
    const link = screen.getByRole('link', { name: /download your plan/i })
    expect(link.getAttribute('href')).toBe('https://files.test/plan.pdf?sig=1')
    expect(link.getAttribute('target')).toBe('_blank')
    expect(link.getAttribute('rel')).toContain('noopener')
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
    expect(screen.queryByTitle('Plan PDF preview')).toBeNull()
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

  it('refreshes the download link before the signed url expires but keeps the preview', async () => {
    jest.useFakeTimers()
    try {
      respond(200, { url: 'https://files.test/a.pdf' })
      render(<PlanViewer chatId="c1" />)
      await act(async () => {})
      respond(200, { url: 'https://files.test/b.pdf' })
      await act(async () => {
        jest.advanceTimersByTime(240_000)
      })
      expect(screen.getByRole('link', { name: /download your plan/i }).getAttribute('href')).toBe('https://files.test/b.pdf')
      expect(screen.getByTitle('Plan PDF preview').getAttribute('src')).toBe('https://files.test/a.pdf')
    } finally {
      jest.useRealTimers()
    }
  })
})
