import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Chat from '@/pages/Chat'

vi.mock('@/lib/acknowledge', () => ({ acknowledge: vi.fn().mockResolvedValue({ reply: '', emergency: false }) }))

const intakeOk = () => vi.fn().mockResolvedValue({ ok: true, status: 201, json: async () => ({ id: 'abc' }) })

const answer = async (user: ReturnType<typeof userEvent.setup>, text: string) => {
  await user.type(screen.getByRole('textbox', { name: 'Message' }), `${text}{Enter}`)
}

describe('Chat page', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', intakeOk())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

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
    await waitFor(() => expect(log()).toMatch(/your name/i))
    await user.type(box, 'Ada Lovelace{Enter}')
    await waitFor(() => expect(log()).toMatch(/best email/i))
    await user.type(box, 'ada@example.com{Enter}')
    await waitFor(() => expect(log()).toMatch(/intake is complete/i))
    expect(log()).toMatch(/licensed doctor/i)
    await waitFor(() => expect(screen.getAllByRole('article').length).toBe(13))
  })

  it('shows a typing indicator, and holds sending, until the reply arrives', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<Chat replyDelay={500} />)
      await user.type(screen.getByRole('textbox', { name: 'Message' }), 'hi{Enter}')
      expect(screen.getByText('Myrakal is typing')).toBeTruthy()
      await user.type(screen.getByRole('textbox', { name: 'Message' }), 'again')
      expect((screen.getByRole('button', { name: 'Send message' }) as HTMLButtonElement).disabled).toBe(true)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(600)
      })
      expect(screen.queryByText('Myrakal is typing')).toBeNull()
      expect(screen.getAllByRole('article').length).toBe(3)
    } finally {
      vi.useRealTimers()
    }
  })

  it('shows a status line and makes the composer read-only once intake is saved, without moving the layout', async () => {
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    const box = screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement
    const status = () => screen.getByRole('status')
    expect(status().textContent).toBe('')
    expect(box.readOnly).toBe(false)
    const answers = ['a', 'b', 'c', 'd', 'Ada Lovelace', 'ada@example.com']
    for (let i = 0; i < answers.length; i++) {
      await user.type(box, `${answers[i]}{Enter}`)
      await waitFor(() => expect(screen.getAllByRole('article').length).toBe(3 + 2 * i))
    }
    expect(status().textContent).toBe('Intake complete. A licensed doctor will review your case.')
    expect(box.readOnly).toBe(true)
    expect(box.getAttribute('aria-readonly')).toBe('true')
    expect(box.disabled).toBe(false)
    box.focus()
    expect(document.activeElement).toBe(box)
    expect(box.placeholder).toBe('Type your message')
    expect(box.className).not.toMatch(/4\.5rem/)
    expect((screen.getByRole('button', { name: 'Send message' }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('asks for the name first, verbatim and trimmed, then the email', async () => {
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    for (const t of ['a', 'b', 'c', 'd']) await answer(user, t)
    await waitFor(() => expect(screen.getAllByRole('article').length).toBe(9))
    expect(screen.getByRole('log').textContent).toMatch(/your name/i)
    await answer(user, '  Dr. Ada Lovelace-King, Jr.  ')
    await waitFor(() => expect(screen.getAllByRole('article').length).toBe(11))
    expect(screen.getByRole('log').textContent).toMatch(/best email/i)
    await answer(user, 'ada@example.com')
    await waitFor(() => expect(screen.getByRole('log').textContent).toMatch(/intake is complete/i))
    expect(JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string).name).toBe('Dr. Ada Lovelace-King, Jr.')
  })

  it('caps the name at 200 characters', async () => {
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    for (const t of ['a', 'b', 'c', 'd', 'x'.repeat(250), 'ada@example.com']) await answer(user, t)
    await waitFor(() => expect(screen.getByRole('log').textContent).toMatch(/intake is complete/i))
    expect(JSON.parse(vi.mocked(fetch).mock.calls[0][1]!.body as string).name).toBe('x'.repeat(200))
  })

  it('asks again, without advancing, when the email step has no valid email', async () => {
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    for (const t of ['a', 'b', 'c', 'd', 'Ada Lovelace']) await answer(user, t)
    await waitFor(() => expect(screen.getAllByRole('article').length).toBe(11))
    await answer(user, 'I would rather not say')
    await waitFor(() => expect(screen.getAllByRole('article').length).toBe(13))
    const log = screen.getByRole('log').textContent ?? ''
    expect(log).toMatch(/couldn't find an email/i)
    expect(log).not.toMatch(/intake is complete/i)
    expect(fetch).not.toHaveBeenCalled()
  })

  it('submits the transcript once, using the last valid email in the message', async () => {
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    for (const t of ['a', 'b', 'c', 'd', 'Ada', 'old@example.com, sorry, I meant new@example.com.']) await answer(user, t)
    await waitFor(() => expect(screen.getByRole('log').textContent).toMatch(/intake is complete/i))
    expect(fetch).toHaveBeenCalledTimes(1)
    const [url, init] = vi.mocked(fetch).mock.calls[0]
    expect(url).toBe('/api/intake')
    const sent = JSON.parse(init!.body as string)
    expect(sent.email).toBe('new@example.com')
    expect(sent.name).toBe('Ada')
    expect(sent.transcript[0].role).toBe('assistant')
    expect(sent.transcript.at(-1)).toEqual({
      role: 'user',
      text: 'old@example.com, sorry, I meant new@example.com.',
    })
  })

  it('apologises with the support email when saving fails, then retries on the next message', async () => {
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('offline'))
      .mockResolvedValueOnce({ ok: true, status: 201, json: async () => ({ id: 'abc' }) })
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    for (const t of ['a', 'b', 'c', 'd', 'Ada', 'ada@example.com']) await answer(user, t)
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain('eshaansood@myrakal.com'))
    expect(screen.getByRole('log').textContent).not.toMatch(/intake is complete/i)
    expect((screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement).readOnly).toBe(false)
    await answer(user, 'please try again')
    await waitFor(() => expect(screen.getByRole('log').textContent).toMatch(/intake is complete/i))
    expect(fetchMock).toHaveBeenCalledTimes(2)
    expect((screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement).readOnly).toBe(true)
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).email).toBe('ada@example.com')
  })

  it('uses a corrected email from the retry message', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, status: 500, json: async () => ({ error: 'x' }) })
      .mockResolvedValueOnce({ ok: true, status: 201, json: async () => ({ id: 'abc' }) })
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    render(<Chat replyDelay={0} />)
    for (const t of ['a', 'b', 'c', 'd', 'Ada', 'ada@exmaple.com']) await answer(user, t)
    await waitFor(() => expect(screen.getByRole('log').textContent).toContain('eshaansood@myrakal.com'))
    await answer(user, 'sorry, typo: ada@example.com')
    await waitFor(() => expect(screen.getByRole('log').textContent).toMatch(/intake is complete/i))
    expect(JSON.parse(fetchMock.mock.calls[1][1].body).email).toBe('ada@example.com')
  })

  it('gives up on a hanging save after 10 seconds and shows the failure message', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      vi.stubGlobal(
        'fetch',
        vi.fn((_url: string, init: RequestInit) =>
          new Promise((_resolve, reject) => {
            init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
          }),
        ),
      )
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<Chat replyDelay={0} />)
      for (const t of ['a', 'b', 'c', 'd', 'Ada', 'ada@example.com']) await answer(user, t)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(10_500)
      })
      expect(screen.getByRole('log').textContent).toContain('eshaansood@myrakal.com')
      expect(screen.queryByText('Myrakal is typing')).toBeNull()
    } finally {
      vi.useRealTimers()
    }
  })

  it('aborts an in-flight save when the page unmounts, without errors', async () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
    let signal: AbortSignal | undefined
    vi.stubGlobal(
      'fetch',
      vi.fn((_url: string, init: RequestInit) => {
        signal = init.signal as AbortSignal
        return new Promise((_resolve, reject) => {
          init.signal?.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')))
        })
      }),
    )
    const user = userEvent.setup()
    const { unmount } = render(<Chat replyDelay={0} />)
    for (const t of ['a', 'b', 'c', 'd', 'Ada', 'ada@example.com']) await answer(user, t)
    await waitFor(() => expect(signal).toBeDefined())
    unmount()
    expect(signal!.aborted).toBe(true)
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(errors).not.toHaveBeenCalled()
    errors.mockRestore()
  })

  it('cancels the reply timer and updates nothing when unmounted mid-reply', () => {
    vi.useFakeTimers()
    try {
      const { unmount } = render(<Chat replyDelay={5000} />)
      const errors = vi.spyOn(console, 'error').mockImplementation(() => {})
      const clear = vi.spyOn(globalThis, 'clearTimeout')
      const baseline = vi.getTimerCount()
      const box = screen.getByRole('textbox', { name: 'Message' })
      act(() => {
        fireEvent.change(box, { target: { value: 'hi' } })
      })
      act(() => {
        fireEvent.keyDown(box, { key: 'Enter' })
      })
      expect(vi.getTimerCount()).toBeGreaterThan(baseline)
      clear.mockClear()
      unmount()
      expect(clear).toHaveBeenCalled()
      act(() => {
        vi.runAllTimers()
      })
      expect(errors).not.toHaveBeenCalled()
      errors.mockRestore()
    } finally {
      vi.useRealTimers()
    }
  })

  it('clears any draft text when the composer locks', async () => {
    const user = userEvent.setup()
    render(<Chat replyDelay={300} />)
    for (const t of ['a', 'b', 'c', 'd', 'Ada']) {
      await answer(user, t)
      await waitFor(() => expect(screen.queryByText('Myrakal is typing')).toBeNull())
    }
    const box = screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement
    await answer(user, 'ada@example.com')
    await user.type(box, 'one more thing')
    expect(box.value).toBe('one more thing')
    await waitFor(() => expect(box.readOnly).toBe(true))
    expect(box.value).toBe('')
  })

  it('shows the completion status only together with the completion message, never beside the typing indicator', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
      render(<Chat replyDelay={500} />)
      for (const t of ['a', 'b', 'c', 'd', 'Ada']) {
        await answer(user, t)
        await act(async () => {
          await vi.advanceTimersByTimeAsync(600)
        })
      }
      await answer(user, 'ada@example.com')
      await act(async () => {
        await vi.advanceTimersByTimeAsync(100)
      })
      expect(screen.getByText('Myrakal is typing')).toBeTruthy()
      expect(fetch).toHaveBeenCalledTimes(1)
      const statuses = screen.getAllByRole('status')
      expect(statuses.filter((s) => s.textContent?.includes('Intake complete'))).toHaveLength(0)
      expect((screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement).readOnly).toBe(false)
      await act(async () => {
        await vi.advanceTimersByTimeAsync(600)
      })
      expect(screen.queryByText('Myrakal is typing')).toBeNull()
      const done = screen.getAllByRole('status')
      expect(done).toHaveLength(1)
      expect(done[0].textContent).toBe('Intake complete. A licensed doctor will review your case.')
      expect(screen.getByRole('log').textContent).toMatch(/intake is complete/i)
      expect((screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement).readOnly).toBe(true)
    } finally {
      vi.useRealTimers()
    }
  })

  describe('emergency notice', () => {
    const NOTICE = 'If this is an emergency, call 911 or your local emergency number. This chat is not monitored in real time.'
    const notice = () => screen.getAllByText(NOTICE)

    it('is shown once, in the footer under the composer, in the initial state', () => {
      render(<Chat replyDelay={0} />)
      expect(notice().length).toBe(1)
      const composer = screen.getByRole('textbox', { name: 'Message' })
      expect(composer.compareDocumentPosition(notice()[0]) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy()
      expect(notice()[0].className).toMatch(/text-muted-foreground/)
    })

    it('stays visible mid-intake and after the intake is complete and locked', async () => {
      const user = userEvent.setup()
      render(<Chat replyDelay={0} />)
      await answer(user, 'a')
      await waitFor(() => expect(screen.getAllByRole('article').length).toBe(3))
      expect(notice().length).toBe(1)
      for (const t of ['b', 'c', 'd', 'Ada Lovelace', 'ada@example.com']) {
        await answer(user, t)
        await waitFor(() => expect((screen.getByRole('button', { name: 'Send message' }) as HTMLButtonElement).disabled).toBe(true))
      }
      await waitFor(() => expect(screen.getByRole('log').textContent).toMatch(/intake is complete/i))
      expect((screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement).readOnly).toBe(true)
      expect(notice().length).toBe(1)
    })

    it('is in the sticky footer block with the composer, not inside the scrolling log', () => {
      render(<Chat replyDelay={0} />)
      expect(screen.getByRole('log').contains(notice()[0])).toBe(false)
      expect(notice()[0].closest('.sticky')).toBe(screen.getByRole('textbox', { name: 'Message' }).closest('.sticky'))
    })
  })
})
