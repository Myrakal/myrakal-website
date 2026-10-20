import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Chat from '@/pages/Chat'

describe('Chat page', () => {
  it('opens with an assistant greeting in a live message log', () => {
    render(<Chat replyDelay={0} />)
    const log = screen.getByRole('log', { name: 'Conversation' })
    expect(log.textContent).toMatch(/diagnosis/i)
  })

  it('needs no sign in: there is no password or email field', () => {
    const { container } = render(<Chat replyDelay={0} />)
    expect(container.querySelector('input[type="password"], input[type="email"]')).toBeNull()
  })

  it('links back home and to the privacy policy', () => {
    render(<Chat replyDelay={0} />)
    expect(screen.getByRole('link', { name: 'Myrakal home' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: 'Privacy Policy' }).getAttribute('href')).toBe('/privacy/')
  })

  it('disables send until there is text', async () => {
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    const send = screen.getByRole('button', { name: 'Send message' }) as HTMLButtonElement
    expect(send.disabled).toBe(true)
    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'hello')
    expect(send.disabled).toBe(false)
  })

  it('adds the visitor message to the log and clears the box on send', async () => {
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    const box = screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement
    await user.type(box, 'I have knee pain')
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    expect(screen.getByRole('log', { name: 'Conversation' }).textContent).toMatch(/I have knee pain/)
    expect(box.value).toBe('')
  })

  it('sends on Enter and keeps a newline on Shift+Enter', async () => {
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    const box = screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement
    await user.type(box, 'line one{Shift>}{Enter}{/Shift}line two')
    expect(box.value).toBe('line one\nline two')
    await user.keyboard('{Enter}')
    expect(box.value).toBe('')
    expect(screen.getByRole('log', { name: 'Conversation' }).textContent).toMatch(/line one/)
  })

  it('ignores whitespace-only messages', async () => {
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    await user.type(screen.getByRole('textbox', { name: 'Message' }), '   {Enter}')
    expect(screen.getAllByRole('article').length).toBe(1)
  })

  it('sends without crypto.randomUUID, as on an insecure http origin', async () => {
    const original = crypto.randomUUID
    Object.defineProperty(crypto, 'randomUUID', { value: undefined, configurable: true })
    try {
      const user = userEvent.setup()
      render(<Chat replyDelay={0} />)
      await user.type(screen.getByRole('textbox', { name: 'Message' }), 'hi{Enter}')
      await waitFor(() => expect(screen.getAllByRole('article').length).toBe(3))
    } finally {
      Object.defineProperty(crypto, 'randomUUID', { value: original, configurable: true })
    }
  })

  it('returns focus to the message box after clicking send', async () => {
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    const box = screen.getByRole('textbox', { name: 'Message' })
    await user.type(box, 'hi')
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    expect(document.activeElement).toBe(box)
  })

  it('walks through the intake questions and finishes with a doctor review notice', async () => {
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    const box = screen.getByRole('textbox', { name: 'Message' })
    const log = () => screen.getByRole('log', { name: 'Conversation' }).textContent ?? ''
    await user.type(box, 'Knee pain{Enter}')
    await waitFor(() => expect(log()).toMatch(/going on|symptoms/i))
    await user.type(box, 'Two months, worse on stairs{Enter}')
    await waitFor(() => expect(log()).toMatch(/labs/i))
    await user.type(box, 'MRI last month{Enter}')
    await waitFor(() => expect(log()).toMatch(/insurance/i))
    await user.type(box, 'Blue Shield PPO{Enter}')
    await waitFor(() => expect(log()).toMatch(/email/i))
    await user.type(box, 'Ada, ada@example.com{Enter}')
    await waitFor(() => expect(log()).toMatch(/intake is complete/i))
    expect(log()).toMatch(/licensed doctor/i)
    await waitFor(() => expect(screen.getAllByRole('article').length).toBe(11))
  })

  it('shows a typing indicator, and holds sending, until the reply arrives', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<Chat replyDelay={500} />)
      await user.type(screen.getByRole('textbox', { name: 'Message' }), 'hi{Enter}')
      expect(screen.getByRole('status').textContent).toBe('Myrakal is typing')
      await user.type(screen.getByRole('textbox', { name: 'Message' }), 'again')
      expect((screen.getByRole('button', { name: 'Send message' }) as HTMLButtonElement).disabled).toBe(true)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(600)
      })
      expect(screen.queryByRole('status')).toBeNull()
      expect(screen.getAllByRole('article').length).toBe(3)
    } finally {
      vi.useRealTimers()
    }
  })

  it('invites extra details once intake is complete', async () => {
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    const box = screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement
    expect(box.placeholder).toBe('Type your message')
    for (let i = 1; i <= 5; i++) {
      await user.type(box, `answer ${i}{Enter}`)
      await waitFor(() => expect(screen.getAllByRole('article').length).toBe(1 + 2 * i))
    }
    expect(box.placeholder).toBe('Add anything else for the doctor')
  })
})
