import { fireEvent, render, screen, waitFor } from '@testing-library/react'

import { ApprovePlan } from './ApprovePlan'

const fetchMock = jest.fn()
const realFetch = globalThis.fetch
globalThis.fetch = fetchMock

const respond = (status: number, body: unknown = {}) =>
  fetchMock.mockResolvedValue({ ok: status >= 200 && status < 300, status, json: async () => body })

const setup = (status = 'plan_ready') => {
  const onApproved = jest.fn()
  render(<ApprovePlan chatId="c1" status={status} onApproved={onApproved} />)
  return { onApproved }
}

const open = () => fireEvent.click(screen.getByRole('button', { name: /^approve plan$/i }))
const confirm = () => fireEvent.click(screen.getByRole('button', { name: /confirm approval/i }))

afterEach(() => fetchMock.mockReset())
afterAll(() => {
  globalThis.fetch = realFetch
})

describe('ApprovePlan', () => {
  it('shows the approve button in plan_ready', () => {
    setup()
    expect(screen.getByRole('button', { name: /^approve plan$/i })).toBeTruthy()
  })

  it.each(['intake', 'doctor_review', 'clarification_review', 'awaiting_payment', 'reservations', 'booked'])(
    'renders nothing in %s',
    (status) => {
      setup(status)
      expect(screen.queryByRole('button')).toBeNull()
    },
  )

  it('asks for confirmation before calling the API', () => {
    setup()
    open()
    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /confirm approval/i })).toBeTruthy()
  })

  it('goes back without calling the API on cancel', () => {
    setup()
    open()
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(fetchMock).not.toHaveBeenCalled()
    expect(screen.getByRole('button', { name: /^approve plan$/i })).toBeTruthy()
  })

  it('posts the approval and reports the new status', async () => {
    respond(200, { status: 'awaiting_payment' })
    const { onApproved } = setup()
    open()
    confirm()
    await waitFor(() => expect(onApproved).toHaveBeenCalledWith('awaiting_payment'))
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/chats/c1/approve')
    expect(init.method).toBe('POST')
  })

  it('disables the buttons while approving', async () => {
    fetchMock.mockReturnValue(new Promise(() => {}))
    setup()
    open()
    confirm()
    await waitFor(() => expect((screen.getByRole('button', { name: /approving/i }) as HTMLButtonElement).disabled).toBe(true))
    expect((screen.getByRole('button', { name: /cancel/i }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('asks for a refresh on a 409', async () => {
    respond(409, { error: 'conflict' })
    const { onApproved } = setup()
    open()
    confirm()
    expect((await screen.findByRole('alert')).textContent).toMatch(/refresh/i)
    expect(onApproved).not.toHaveBeenCalled()
  })

  it('asks to sign in again on a 401', async () => {
    respond(401, {})
    setup()
    open()
    confirm()
    expect((await screen.findByRole('alert')).textContent).toMatch(/sign in again/i)
  })

  it('lets the patient retry after a network failure', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    setup()
    open()
    confirm()
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not approve/i)
    expect((screen.getByRole('button', { name: /confirm approval/i }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('treats an unreadable 200 body as approved', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => { throw new SyntaxError() } })
    const { onApproved } = setup()
    open()
    confirm()
    await waitFor(() => expect(onApproved).toHaveBeenCalledWith('awaiting_payment'))
  })

  it('moves focus to the confirm button', () => {
    setup()
    open()
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /confirm approval/i }))
  })

  it('returns focus to the approve button on cancel', () => {
    setup()
    open()
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /^approve plan$/i }))
  })

  it('sends only one request for rapid double clicks', async () => {
    fetchMock.mockReturnValue(new Promise(() => {}))
    setup()
    open()
    const button = screen.getByRole('button', { name: /confirm approval/i })
    fireEvent.click(button)
    fireEvent.click(button)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('stops offering the confirm button after a 409', async () => {
    respond(409, {})
    setup()
    open()
    confirm()
    await screen.findByRole('alert')
    expect((screen.getByRole('button', { name: /confirm approval/i }) as HTMLButtonElement).disabled).toBe(true)
  })
})
