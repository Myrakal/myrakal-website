import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FORMSPREE_ENDPOINT } from '@/lib/contact'
import { TalkWithUs } from '@/components/TalkWithUs'

const fetchMock = jest.fn()

beforeEach(() => {
  fetchMock.mockReset()
  global.fetch = fetchMock as unknown as typeof fetch
})

const open = async () => {
  const user = userEvent.setup()
  render(<TalkWithUs className="x">Talk with us</TalkWithUs>)
  await user.click(screen.getByRole('button', { name: 'Talk with us' }))
  return user
}

const fill = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(screen.getByLabelText('Name'), 'Ada')
  await user.type(screen.getByLabelText('Email'), 'ada@example.com')
  await user.type(screen.getByLabelText('Message'), 'Need help')
}

describe('TalkWithUs modal', () => {
  it('is closed until the button is pressed', async () => {
    render(<TalkWithUs className="x">Talk with us</TalkWithUs>)
    expect(screen.queryByRole('dialog')).toBeNull()
    await userEvent.click(screen.getByRole('button', { name: 'Talk with us' }))
    const dialog = screen.getByRole('dialog', { name: /talk with us/i })
    expect(dialog.getAttribute('aria-modal')).toBe('true')
  })

  it('moves focus to the first field and returns it on close', async () => {
    const user = await open()
    expect(screen.getByLabelText('Name')).toHaveFocus()
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(screen.getByRole('button', { name: 'Talk with us' })).toHaveFocus()
  })

  it('closes on backdrop click but not on dialog click', async () => {
    const user = await open()
    await user.click(screen.getByRole('dialog'))
    expect(screen.getByRole('dialog')).toBeTruthy()
    await user.click(screen.getByTestId('contact-backdrop'))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('posts JSON to Formspree and shows success', async () => {
    fetchMock.mockResolvedValue({ ok: true })
    const user = await open()
    await fill(user)
    await user.click(screen.getByRole('button', { name: 'Send' }))
    await waitFor(() => expect(screen.getByRole('status').textContent).toMatch(/thank you/i))
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe(FORMSPREE_ENDPOINT)
    expect(init.method).toBe('POST')
    expect(init.headers).toMatchObject({ Accept: 'application/json', 'Content-Type': 'application/json' })
    expect(JSON.parse(init.body)).toMatchObject({ name: 'Ada', email: 'ada@example.com', message: 'Need help', _gotcha: '' })
  })

  it('disables the submit button while sending', async () => {
    fetchMock.mockReturnValue(new Promise(() => {}))
    const user = await open()
    await fill(user)
    await user.click(screen.getByRole('button', { name: 'Send' }))
    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled()
  })

  it('shows an error and keeps the form when sending fails', async () => {
    fetchMock.mockResolvedValue({ ok: false })
    const user = await open()
    await fill(user)
    await user.click(screen.getByRole('button', { name: 'Send' }))
    await waitFor(() => expect(screen.getByRole('alert').textContent).toMatch(/something went wrong/i))
    expect(screen.getByLabelText('Message')).toHaveValue('Need help')
  })

  it('shows an error when the network throws', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    const user = await open()
    await fill(user)
    await user.click(screen.getByRole('button', { name: 'Send' }))
    await waitFor(() => expect(screen.getByRole('alert')).toBeTruthy())
  })

  it('has a hidden honeypot field', async () => {
    await open()
    const trap = document.querySelector('input[name="_gotcha"]') as HTMLInputElement
    expect(trap.tabIndex).toBe(-1)
    expect(trap.closest('[aria-hidden="true"]')).not.toBeNull()
  })

  it('renders the dialog on document.body outside the trigger wrapper', async () => {
    const { container } = render(
      <div style={{ transform: 'translateY(-50%)' }}>
        <TalkWithUs className="x">Talk with us</TalkWithUs>
      </div>,
    )
    await userEvent.click(screen.getByRole('button', { name: 'Talk with us' }))
    expect(container.contains(screen.getByRole('dialog'))).toBe(false)
  })

  it('stays open when a text selection drag ends on the backdrop', async () => {
    await open()
    fireEvent.mouseDown(screen.getByLabelText('Message'))
    fireEvent.click(screen.getByTestId('contact-backdrop'))
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('moves focus into the dialog after a successful send', async () => {
    fetchMock.mockResolvedValue({ ok: true })
    const user = await open()
    await fill(user)
    await user.click(screen.getByRole('button', { name: 'Send' }))
    await waitFor(() => expect(screen.getByRole('dialog')).toHaveFocus())
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).toBeNull()
  })
})
