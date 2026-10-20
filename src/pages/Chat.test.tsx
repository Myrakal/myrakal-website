import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Chat from '@/pages/Chat'

describe('Chat page', () => {
  it('opens with an assistant greeting in a live message log', () => {
    render(<Chat />)
    const log = screen.getByRole('log', { name: 'Conversation' })
    expect(log.textContent).toMatch(/diagnosis/i)
  })

  it('needs no sign in: there is no password or email field', () => {
    const { container } = render(<Chat />)
    expect(container.querySelector('input[type="password"], input[type="email"]')).toBeNull()
  })

  it('links back home and to the privacy policy', () => {
    render(<Chat />)
    expect(screen.getByRole('link', { name: 'Myrakal home' }).getAttribute('href')).toBe('/')
    expect(screen.getByRole('link', { name: 'Privacy Policy' }).getAttribute('href')).toBe('/privacy/')
  })

  it('disables send until there is text', async () => {
    const user = userEvent.setup()
    render(<Chat />)
    const send = screen.getByRole('button', { name: 'Send message' }) as HTMLButtonElement
    expect(send.disabled).toBe(true)
    await user.type(screen.getByRole('textbox', { name: 'Message' }), 'hello')
    expect(send.disabled).toBe(false)
  })

  it('adds the visitor message to the log and clears the box on send', async () => {
    const user = userEvent.setup()
    render(<Chat />)
    const box = screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement
    await user.type(box, 'I have knee pain')
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    expect(screen.getByRole('log', { name: 'Conversation' }).textContent).toMatch(/I have knee pain/)
    expect(box.value).toBe('')
  })

  it('sends on Enter and keeps a newline on Shift+Enter', async () => {
    const user = userEvent.setup()
    render(<Chat />)
    const box = screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement
    await user.type(box, 'line one{Shift>}{Enter}{/Shift}line two')
    expect(box.value).toBe('line one\nline two')
    await user.keyboard('{Enter}')
    expect(box.value).toBe('')
    expect(screen.getByRole('log', { name: 'Conversation' }).textContent).toMatch(/line one/)
  })

  it('ignores whitespace-only messages', async () => {
    const user = userEvent.setup()
    render(<Chat />)
    await user.type(screen.getByRole('textbox', { name: 'Message' }), '   {Enter}')
    expect(screen.getAllByRole('article').length).toBe(1)
  })

  it('sends without crypto.randomUUID, as on an insecure http origin', async () => {
    const original = crypto.randomUUID
    Object.defineProperty(crypto, 'randomUUID', { value: undefined, configurable: true })
    try {
      const user = userEvent.setup()
      render(<Chat />)
      await user.type(screen.getByRole('textbox', { name: 'Message' }), 'hi{Enter}')
      expect(screen.getAllByRole('article').length).toBe(3)
    } finally {
      Object.defineProperty(crypto, 'randomUUID', { value: original, configurable: true })
    }
  })

  it('returns focus to the message box after clicking send', async () => {
    const user = userEvent.setup()
    render(<Chat />)
    const box = screen.getByRole('textbox', { name: 'Message' })
    await user.type(box, 'hi')
    await user.click(screen.getByRole('button', { name: 'Send message' }))
    expect(document.activeElement).toBe(box)
  })

  it('walks through the intake questions and finishes with a doctor review notice', async () => {
    const user = userEvent.setup()
    render(<Chat />)
    const box = screen.getByRole('textbox', { name: 'Message' })
    const log = () => screen.getByRole('log', { name: 'Conversation' }).textContent ?? ''
    await user.type(box, 'Knee pain{Enter}')
    expect(log()).toMatch(/going on|symptoms/i)
    await user.type(box, 'Two months, worse on stairs{Enter}')
    expect(log()).toMatch(/labs/i)
    await user.type(box, 'MRI last month{Enter}')
    expect(log()).toMatch(/insurance/i)
    await user.type(box, 'Blue Shield PPO{Enter}')
    expect(log()).toMatch(/email/i)
    await user.type(box, 'Ada, ada@example.com{Enter}')
    expect(log()).toMatch(/intake is complete/i)
    expect(log()).toMatch(/licensed doctor/i)
    expect(screen.getAllByRole('article').length).toBe(11)
  })
})
