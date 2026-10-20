import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Chat from '@/pages/Chat'
import { INTAKE_PROMPTS, withoutThanks } from '@/lib/intake'

type Route = (init: RequestInit) => Promise<unknown> | unknown

const respond = (status: number, body: unknown) => ({ ok: status < 400, status, json: async () => body })

const routes = (chat: Route) =>
  vi.fn((url: string, init: RequestInit) =>
    Promise.resolve(url === '/api/chat' ? chat(init) : respond(201, { id: 'abc' })),
  )

const calls = (path: string) => vi.mocked(fetch).mock.calls.filter(([url]) => url === path)

const answer = async (user: ReturnType<typeof userEvent.setup>, text: string) => {
  await user.type(screen.getByRole('textbox', { name: 'Message' }), `${text}{Enter}`)
}

const log = () => screen.getByRole('log').textContent ?? ''

describe('Chat with AI acknowledgements', () => {
  afterEach(() => vi.unstubAllGlobals())

  it('puts the acknowledgement before the next scripted question', async () => {
    vi.stubGlobal('fetch', routes(() => respond(200, { reply: "I'm sorry you're dealing with that." })))
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    await answer(user, 'knee pain')
    await waitFor(() =>
      expect(screen.getAllByRole('article').at(-1)!.textContent).toBe(
        `I'm sorry you're dealing with that. ${withoutThanks(INTAKE_PROMPTS[0])}`,
      ),
    )
  })

  it('shows just the scripted question when the acknowledgement is empty', async () => {
    vi.stubGlobal('fetch', routes(() => respond(200, { reply: '' })))
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    await answer(user, 'knee pain')
    await waitFor(() => expect(screen.getAllByRole('article').at(-1)!.textContent).toBe(INTAKE_PROMPTS[0]))
  })

  it('falls back to the scripted flow when the request fails', async () => {
    vi.stubGlobal('fetch', routes(() => Promise.reject(new TypeError('offline'))))
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    await answer(user, 'knee pain')
    await waitFor(() => expect(screen.getAllByRole('article').at(-1)!.textContent).toBe(INTAKE_PROMPTS[0]))
    await answer(user, 'two months')
    await waitFor(() => expect(screen.getAllByRole('article').at(-1)!.textContent).toBe(INTAKE_PROMPTS[1]))
  })

  it('keeps the typing indicator until the composed message arrives', async () => {
    let release: (v: unknown) => void = () => {}
    vi.stubGlobal('fetch', routes(() => new Promise((resolve) => (release = resolve))))
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    await answer(user, 'knee pain')
    await waitFor(() => expect(calls('/api/chat').length).toBe(1))
    expect(screen.getByText('Myrakal is typing')).toBeTruthy()
    expect(screen.getAllByRole('article').length).toBe(2)
    release(respond(200, { reply: 'Thank you for telling me.' }))
    await waitFor(() => expect(screen.getAllByRole('article').length).toBe(3))
    expect(screen.queryByText('Myrakal is typing')).toBeNull()
  })

  it('sends exactly one message, the latest visitor message with emails redacted, never earlier or assistant turns', async () => {
    vi.stubGlobal('fetch', routes(() => respond(200, { reply: '' })))
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    await answer(user, 'first answer')
    await waitFor(() => expect(screen.getAllByRole('article').length).toBe(3))
    await answer(user, 'my email is ada@example.com')
    await waitFor(() => expect(calls('/api/chat').length).toBe(2))
    const first = JSON.parse(calls('/api/chat')[0][1]!.body as string)
    const second = JSON.parse(calls('/api/chat')[1][1]!.body as string)
    expect(first.messages).toEqual([{ role: 'user', text: 'first answer' }])
    expect(second.messages).toEqual([{ role: 'user', text: 'my email is [email]' }])
    expect(JSON.stringify([first, second])).not.toMatch(/@|assistant/)
  })

  it('shows a long emergency reply intact ahead of the scripted question', async () => {
    const emergency =
      "I'm concerned about what you've described. Please contact your local emergency services right away, or go to the nearest emergency room. If you are in the US and having thoughts of harming yourself, call or text 988 now. You do not need to finish this form first, your safety matters most. We will be here when you are ready."
    vi.stubGlobal('fetch', routes(() => respond(200, { reply: emergency })))
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    await answer(user, 'chest pain')
    await waitFor(() => expect(screen.getAllByRole('article').length).toBe(3))
    expect(screen.getAllByRole('article').at(-1)!.textContent).toBe(`${emergency} ${withoutThanks(INTAKE_PROMPTS[0])}`)
  })

  it('asks the AI only after the first four answers, never for the name, the email or later', async () => {
    vi.stubGlobal('fetch', routes(() => respond(200, { reply: 'Thank you.' })))
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    for (const t of ['a', 'b', 'c', 'd']) {
      await answer(user, t)
      await waitFor(() => expect(screen.getByRole('textbox', { name: 'Message' })).toBeTruthy())
      await waitFor(() => expect((screen.getByRole('button', { name: 'Send message' }) as HTMLButtonElement).disabled).toBe(true))
    }
    await waitFor(() => expect(calls('/api/chat').length).toBe(4))
    await answer(user, 'Ada Lovelace')
    await waitFor(() => expect(log()).toMatch(/best email/i))
    await answer(user, 'not an email')
    await waitFor(() => expect(log()).toMatch(/couldn't find an email/i))
    await answer(user, 'ada@example.com')
    await waitFor(() => expect(log()).toMatch(/intake is complete/i))
    expect(calls('/api/chat').length).toBe(4)
    expect(JSON.stringify(calls('/api/chat').map(([, init]) => init!.body))).not.toMatch(/Ada Lovelace/)
    expect(calls('/api/intake').length).toBe(1)
  })

  it('aborts an in-flight acknowledgement on unmount, without errors', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    let signal: AbortSignal | undefined
    vi.stubGlobal(
      'fetch',
      routes((init) => {
        signal = init.signal as AbortSignal
        return new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
        })
      }),
    )
    const user = userEvent.setup()
    const { unmount } = render(<Chat replyDelay={0} />)
    await answer(user, 'knee pain')
    await waitFor(() => expect(signal).toBeDefined())
    unmount()
    expect(signal!.aborted).toBe(true)
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(errors).not.toHaveBeenCalled()
    errors.mockRestore()
  })

  it('does not stack two thank-yous when the acknowledgement already thanks the visitor', async () => {
    vi.stubGlobal('fetch', routes(() => respond(200, { reply: 'Thank you for sharing that.' })))
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    await answer(user, 'knee pain')
    await waitFor(() => expect(screen.getAllByRole('article').length).toBe(3))
    expect(screen.getAllByRole('article').at(-1)!.textContent).not.toMatch(/thank you[\s\S]*thank you/i)
  })

  it('stops calling the API for the session after a 503 and keeps the scripted flow going', async () => {
    vi.stubGlobal('fetch', routes(() => respond(503, { error: 'off' })))
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    await answer(user, 'a')
    await waitFor(() => expect(screen.getAllByRole('article').at(-1)!.textContent).toBe(INTAKE_PROMPTS[0]))
    await answer(user, 'b')
    await waitFor(() => expect(screen.getAllByRole('article').at(-1)!.textContent).toBe(INTAKE_PROMPTS[1]))
    expect(calls('/api/chat').length).toBe(1)
  })
})
