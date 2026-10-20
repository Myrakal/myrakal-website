import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { detectEmergency, EMERGENCY_REPLY } from '@/lib/emergency'
import { EMERGENCY_CONTINUE, INTAKE_PROMPTS, INTAKE_STEPS } from '@/lib/intake'

type Rtl = typeof import('@testing-library/react')
type Route = (init: RequestInit) => Promise<unknown> | unknown

let rtl: Rtl
let Chat: typeof import('@/pages/Chat').default

const respond = (status: number, body: unknown) => ({ ok: status < 400, status, json: async () => body })

const routes = (chat: Route) =>
  vi.fn((url: string, init: RequestInit) =>
    Promise.resolve(url === '/api/chat' ? chat(init) : respond(201, { id: 'abc' })),
  )

const calls = (path: string) => vi.mocked(fetch).mock.calls.filter(([url]) => url === path)

const answer = async (user: ReturnType<typeof userEvent.setup>, text: string) => {
  await user.type(rtl.screen.getByRole('textbox', { name: 'Message' }), `${text}{Enter}`)
}

const articles = () => rtl.screen.getAllByRole('article')
const lastText = () => articles().at(-1)!.textContent
const log = () => rtl.screen.getByRole('log').textContent ?? ''
const settled = () =>
  rtl.waitFor(() => expect((rtl.screen.getByRole('button', { name: 'Send message' }) as HTMLButtonElement).disabled).toBe(true))
const shows = (n: number) => rtl.waitFor(() => expect(articles().length).toBe(n))
const transcript = () => JSON.parse(calls('/api/intake')[0][1]!.body as string)
const assistantTexts = () =>
  transcript()
    .transcript.filter((m: { role: string }) => m.role === 'assistant')
    .map((m: { text: string }) => m.text)

const ok = (reply: string, emergency = false) => respond(200, { reply, emergency })
const down = () => Promise.reject(new TypeError('offline'))

describe('Chat with AI acknowledgements', () => {
  beforeEach(async () => {
    vi.resetModules()
    rtl = await import('@testing-library/react')
    Chat = (await import('@/pages/Chat')).default
  })

  afterEach(() => {
    rtl.cleanup()
    vi.unstubAllGlobals()
  })

  it('puts the acknowledgement before the next scripted question', async () => {
    vi.stubGlobal('fetch', routes(() => ok("I'm sorry you're dealing with that.")))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'knee pain')
    await shows(3)
    expect(lastText()).toBe(`I'm sorry you're dealing with that. ${INTAKE_STEPS[0].ask}`)
  })

  it('shows just the scripted question when the acknowledgement is empty', async () => {
    vi.stubGlobal('fetch', routes(() => ok('')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'knee pain')
    await shows(3)
    expect(lastText()).toBe(INTAKE_PROMPTS[0])
  })

  it('falls back to the scripted flow when the request fails', async () => {
    vi.stubGlobal('fetch', routes(down))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'knee pain')
    await shows(3)
    expect(lastText()).toBe(INTAKE_PROMPTS[0])
    await answer(user, 'two months')
    await shows(5)
    expect(lastText()).toBe(INTAKE_PROMPTS[1])
  })

  it('keeps the typing indicator until the composed message arrives', async () => {
    let release: (v: unknown) => void = () => {}
    vi.stubGlobal('fetch', routes(() => new Promise((resolve) => (release = resolve))))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'knee pain')
    await rtl.waitFor(() => expect(calls('/api/chat').length).toBe(1))
    expect(rtl.screen.getByText('Myrakal is typing')).toBeTruthy()
    expect(articles().length).toBe(2)
    release(ok('Thank you for telling me.'))
    await shows(3)
    expect(rtl.screen.queryByText('Myrakal is typing')).toBeNull()
  })

  it('sends exactly one message, the latest visitor message, never earlier or assistant turns', async () => {
    vi.stubGlobal('fetch', routes(() => ok('')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'first answer')
    await shows(3)
    await answer(user, 'second answer')
    await rtl.waitFor(() => expect(calls('/api/chat').length).toBe(2))
    const [first, second] = calls('/api/chat').map(([, init]) => JSON.parse(init!.body as string))
    expect(first.messages).toEqual([{ role: 'user', text: 'first answer' }])
    expect(second.messages).toEqual([{ role: 'user', text: 'second answer' }])
    expect(JSON.stringify([first, second])).not.toMatch(/assistant|Myrakal/)
  })

  it('asks the AI only after the first four answers, never for the name, the email or later', async () => {
    vi.stubGlobal('fetch', routes(() => ok('Thank you.')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    for (const t of ['a', 'b', 'c', 'd']) {
      await answer(user, t)
      await settled()
    }
    await rtl.waitFor(() => expect(calls('/api/chat').length).toBe(4))
    await answer(user, 'Ada Lovelace')
    await rtl.waitFor(() => expect(log()).toMatch(/best email/i))
    await answer(user, 'not an email')
    await rtl.waitFor(() => expect(log()).toMatch(/couldn't find an email/i))
    await answer(user, 'ada@example.com')
    await rtl.waitFor(() => expect(log()).toMatch(/intake is complete/i))
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
    const { unmount } = rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'knee pain')
    await rtl.waitFor(() => expect(signal).toBeDefined())
    unmount()
    expect(signal!.aborted).toBe(true)
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(errors).not.toHaveBeenCalled()
    errors.mockRestore()
  })

  it('does not stack two thank-yous when the acknowledgement already thanks the visitor', async () => {
    vi.stubGlobal('fetch', routes(() => ok('Thank you for sharing that.')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'knee pain')
    await shows(3)
    expect(lastText()).toBe(`Thank you for sharing that. ${INTAKE_STEPS[0].ask}`)
  })

  it('skips the AI call when the message has an at sign or an obfuscated address', async () => {
    vi.stubGlobal('fetch', routes(() => ok('Thank you.')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'my sister is ada@example.com')
    await shows(3)
    await answer(user, 'or ada at example dot com')
    await shows(5)
    expect(calls('/api/chat').length).toBe(0)
    expect(lastText()).toBe(INTAKE_PROMPTS[1])
  })

  it('shows the acknowledgement but never stores it', async () => {
    vi.stubGlobal('fetch', routes(() => ok('I am so sorry you are dealing with that.')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    for (const t of ['a', 'b', 'c', 'd', 'Ada Lovelace']) {
      await answer(user, t)
      await settled()
    }
    await rtl.waitFor(() => expect(log()).toContain('I am so sorry you are dealing with that.'))
    await answer(user, 'ada@example.com')
    await rtl.waitFor(() => expect(log()).toMatch(/intake is complete/i))
    expect(JSON.stringify(transcript().transcript)).not.toContain('I am so sorry')
    expect(assistantTexts().slice(1, 6)).toEqual(INTAKE_PROMPTS)
  })

  it('stops asking after a 404 for the session', async () => {
    vi.stubGlobal('fetch', routes(() => respond(404, {})))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'a')
    await shows(3)
    await answer(user, 'b')
    await shows(5)
    expect(calls('/api/chat').length).toBe(1)
  })

  it('stops calling the API for the session after a 503 and keeps the scripted flow going', async () => {
    vi.stubGlobal('fetch', routes(() => respond(503, { error: 'off' })))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'a')
    await shows(3)
    expect(lastText()).toBe(INTAKE_PROMPTS[0])
    await answer(user, 'b')
    await shows(5)
    expect(lastText()).toBe(INTAKE_PROMPTS[1])
    expect(calls('/api/chat').length).toBe(1)
  })
})

describe('Chat emergency screening', () => {
  beforeEach(async () => {
    vi.resetModules()
    rtl = await import('@testing-library/react')
    Chat = (await import('@/pages/Chat')).default
  })

  afterEach(() => {
    rtl.cleanup()
    vi.unstubAllGlobals()
  })

  const shownEmergency = () => {
    const alert = rtl.screen.getByRole('alert')
    expect(alert.textContent).toContain(EMERGENCY_REPLY)
    return alert
  }

  it('shows the local emergency message, marked as an alert, with the continue line, and never calls the AI', async () => {
    vi.stubGlobal('fetch', routes(() => ok('should not be asked')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'I have chest pain')
    await shows(3)
    expect(shownEmergency().closest('article')!.textContent).toBe(`${EMERGENCY_REPLY}${EMERGENCY_CONTINUE}`)
    expect(lastText()).not.toContain(INTAKE_STEPS[0].ask)
    expect(calls('/api/chat').length).toBe(0)
  })

  it('screens a message that also contains an email, and does not send it anywhere', async () => {
    vi.stubGlobal('fetch', routes(() => ok('nope')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, "chest pain, can't breathe, email me at a@b.com")
    await shows(3)
    shownEmergency()
    expect(calls('/api/chat').length).toBe(0)
    expect(calls('/api/intake').length).toBe(0)
  })

  it('does not advance, and the next normal answer to the same question advances', async () => {
    vi.stubGlobal('fetch', routes(() => ok('Thank you for telling me.')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'I have chest pain')
    await shows(3)
    shownEmergency()
    await answer(user, 'It started last week')
    await shows(5)
    expect(lastText()).toBe(`Thank you for telling me. ${INTAKE_STEPS[0].ask}`)
    expect(calls('/api/chat').length).toBe(1)
  })

  it('screens at the name step without taking the message as the name', async () => {
    vi.stubGlobal('fetch', routes(() => ok('')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    for (const t of ['a', 'b', 'c', 'd']) {
      await answer(user, t)
      await settled()
    }
    await shows(9)
    await answer(user, 'I want to die')
    await shows(11)
    shownEmergency()
    await answer(user, 'Ada Lovelace')
    await shows(13)
    expect(lastText()).toMatch(/best email/i)
    await answer(user, 'ada@example.com')
    await rtl.waitFor(() => expect(log()).toMatch(/intake is complete/i))
    expect(transcript().name).toBe('Ada Lovelace')
  })

  it('screens at the email step without taking an email in it, and without saving', async () => {
    vi.stubGlobal('fetch', routes(() => ok('')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    for (const t of ['a', 'b', 'c', 'd', 'Ada']) {
      await answer(user, t)
      await settled()
    }
    await shows(11)
    await answer(user, "I can't breathe, ada@example.com")
    await shows(13)
    shownEmergency()
    expect(calls('/api/intake').length).toBe(0)
    await answer(user, 'ada@example.com')
    await rtl.waitFor(() => expect(log()).toMatch(/intake is complete/i))
    expect(calls('/api/intake').length).toBe(1)
  })

  it('screens during a failed-save retry without retrying the save', async () => {
    const fetchMock = vi.fn((url: string) =>
      Promise.resolve(url === '/api/chat' ? ok('') : respond(500, { error: 'x' })),
    )
    vi.stubGlobal('fetch', fetchMock)
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    for (const t of ['a', 'b', 'c', 'd', 'Ada', 'ada@example.com']) {
      await answer(user, t)
      await settled()
    }
    await rtl.waitFor(() => expect(log()).toContain('eshaansood@myrakal.com'))
    const before = calls('/api/intake').length
    await answer(user, 'I am having a seizure')
    await rtl.waitFor(() => expect(rtl.screen.getByRole('alert')).toBeTruthy())
    expect(calls('/api/intake').length).toBe(before)
  })

  it('shows the same local message when the server flags an emergency, ignoring its text, without advancing', async () => {
    vi.stubGlobal('fetch', routes(() => ok('SERVER TEXT THAT MUST NOT APPEAR', true)))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'my knee has been bothering me')
    await shows(3)
    expect(log()).not.toContain('SERVER TEXT')
    shownEmergency()
    expect(lastText()).not.toContain(INTAKE_STEPS[0].ask)
  })

  it('stores only the fixed local message for emergencies, and no model text', async () => {
    const replies = ['MODEL ONE.', 'MODEL TWO.', 'MODEL THREE.', 'MODEL FOUR.']
    vi.stubGlobal('fetch', routes(() => ok(replies.shift() ?? '')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    for (const t of ['chest pain', 'a', 'b', 'c', 'd', 'Ada']) {
      await answer(user, t)
      await settled()
    }
    await answer(user, 'ada@example.com')
    await rtl.waitFor(() => expect(log()).toMatch(/intake is complete/i))
    expect(assistantTexts()[1]).toBe(EMERGENCY_REPLY)
    expect(JSON.stringify(transcript().transcript)).not.toContain('MODEL')
    expect(JSON.stringify(transcript().transcript)).not.toContain(EMERGENCY_CONTINUE.trim())
  })

  it('screens with the network down and after the AI is marked unavailable', async () => {
    vi.stubGlobal('fetch', routes(() => respond(503, {})))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'a')
    await shows(3)
    await answer(user, 'b')
    await shows(5)
    vi.stubGlobal('fetch', vi.fn(down))
    await answer(user, 'I have trouble breathing')
    await shows(7)
    shownEmergency()
    expect(lastText()).not.toContain(INTAKE_STEPS[2].ask)
  })

  it('keeps the composer usable after an emergency message', async () => {
    vi.stubGlobal('fetch', routes(() => ok('')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'chest pain')
    await shows(3)
    const box = rtl.screen.getByRole('textbox', { name: 'Message' }) as HTMLTextAreaElement
    expect(box.readOnly).toBe(false)
    expect(box.disabled).toBe(false)
  })

  it.each([
    'my knee hurts when I climb stairs',
    'about two months',
    'MRI last month, blood work from March',
    'Blue Shield PPO',
    'Ada Lovelace',
    'can you help me understand my costs',
    'I would like to see my options abroad',
    "I'm a little worried about the price",
  ])('does not treat the ordinary answer "%s" as an emergency', (text) => {
    expect(detectEmergency(text)).toBe(false)
  })

  it('completes a whole intake with realistic benign answers and never shows an alert', async () => {
    vi.stubGlobal('fetch', routes(() => ok('Thank you.')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    for (const t of [
      'my knee hurts when I climb stairs',
      'about two months',
      'MRI last month, blood work from March',
      'Blue Shield PPO',
      'Ada Lovelace',
    ]) {
      await answer(user, t)
      await settled()
    }
    await answer(user, 'ada@example.com')
    await rtl.waitFor(() => expect(log()).toMatch(/intake is complete/i))
    expect(rtl.screen.queryByRole('alert')).toBeNull()
    expect(assistantTexts()).not.toContain(EMERGENCY_REPLY)
  })

  it('asks the AI about a help request that is not an emergency, and keeps the flow going', async () => {
    vi.stubGlobal('fetch', routes(() => ok('Happy to help.')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'can you help me understand my costs')
    await shows(3)
    expect(rtl.screen.queryByRole('alert')).toBeNull()
    expect(lastText()).toBe(`Happy to help. ${INTAKE_STEPS[0].ask}`)
  })

  it('screens a denial too, because the detector no longer tries to read negation', async () => {
    vi.stubGlobal('fetch', routes(() => ok('')))
    const user = userEvent.setup()
    rtl.render(<Chat replyDelay={0} />)
    await answer(user, 'no chest pain')
    await shows(3)
    shownEmergency()
    expect(calls('/api/chat').length).toBe(0)
  })
})
