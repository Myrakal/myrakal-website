import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { TextUsButton } from '@/components/TextUsButton'
import { CONTACT_EMAIL, FORMSPREE_ENDPOINT } from '@/lib/contact'

const fill = async () => {
  await userEvent.type(screen.getByLabelText('Name'), 'Dana Lee')
  await userEvent.type(screen.getByLabelText('Email'), 'dana@example.com')
  await userEvent.selectOptions(screen.getByLabelText('Treatment'), 'Dental')
  await userEvent.type(screen.getByLabelText('Your quote, or what you need'), '$34,000 for All-on-4')
}

describe('quote form', () => {
  afterEach(() => jest.restoreAllMocks())

  it('opens a labeled dialog and focuses the first field', async () => {
    render(<TextUsButton />)
    await userEvent.click(screen.getByRole('button', { name: 'Send your quote' }))
    const dialog = screen.getByRole('dialog', { name: 'Send your quote' })
    expect(dialog).toBeInTheDocument()
    expect(screen.getByLabelText('Name')).toHaveFocus()
    for (const label of ['Email', 'Phone (optional)', 'Treatment', 'Your quote, or what you need', 'How did you hear about us? (optional)']) {
      expect(screen.getByLabelText(label)).toBeInTheDocument()
    }
  })

  it('links the privacy policy from the form', async () => {
    render(<TextUsButton />)
    await userEvent.click(screen.getByRole('button', { name: 'Send your quote' }))
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
  })

  it('sends the request to the Formspree form and thanks the visitor', async () => {
    const fetchMock = jest.fn().mockResolvedValue({ ok: true })
    global.fetch = fetchMock as unknown as typeof fetch
    render(<TextUsButton />)
    await userEvent.click(screen.getByRole('button', { name: 'Send your quote' }))
    await fill()
    await userEvent.click(screen.getByRole('button', { name: 'Send' }))
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent(/within 2 business days/))
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(FORMSPREE_ENDPOINT)
    const body = JSON.parse(init.body)
    expect(body).toMatchObject({ name: 'Dana Lee', email: 'dana@example.com', treatment: 'Dental', message: '$34,000 for All-on-4', page: '/' })
    expect(body._subject).toMatch(/quote/i)
  })

  it('falls back to the email address when sending fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false }) as unknown as typeof fetch
    render(<TextUsButton />)
    await userEvent.click(screen.getByRole('button', { name: 'Send your quote' }))
    await fill()
    await userEvent.click(screen.getByRole('button', { name: 'Send' }))
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(CONTACT_EMAIL))
  })

  it('keeps what you typed if you close and reopen before sending', async () => {
    render(<TextUsButton />)
    await userEvent.click(screen.getByRole('button', { name: 'Send your quote' }))
    await userEvent.type(screen.getByLabelText('Name'), 'Dana')
    act(() => void fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' }))
    await userEvent.click(screen.getByRole('button', { name: 'Send your quote' }))
    expect(screen.getByLabelText('Name')).toHaveValue('Dana')
  })

  it('keeps focus usable while sending and links the fallback email', async () => {
    let finish: (value: { ok: boolean }) => void = () => {}
    global.fetch = jest.fn(() => new Promise((resolve) => (finish = resolve))) as unknown as typeof fetch
    render(<TextUsButton />)
    await userEvent.click(screen.getByRole('button', { name: 'Send your quote' }))
    await fill()
    const send = screen.getByRole('button', { name: 'Send' })
    await userEvent.click(send)
    const sending = screen.getByRole('button', { name: 'Sending...' })
    expect(sending).not.toBeDisabled()
    expect(sending).toHaveAttribute('aria-disabled', 'true')
    act(() => void fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    await act(async () => finish({ ok: false }))
    expect(screen.getByRole('alert').querySelector(`a[href="mailto:${CONTACT_EMAIL}"]`)).not.toBeNull()
  })

  it('moves focus to Close after a successful send', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: true }) as unknown as typeof fetch
    render(<TextUsButton />)
    await userEvent.click(screen.getByRole('button', { name: 'Send your quote' }))
    await fill()
    await userEvent.click(screen.getByRole('button', { name: 'Send' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus())
  })

  it('closes on Escape and returns focus to the button', async () => {
    render(<TextUsButton />)
    const trigger = screen.getByRole('button', { name: 'Send your quote' })
    await userEvent.click(trigger)
    act(() => void fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' }))
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(trigger).toHaveFocus()
  })
})
