import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'

import { CommentSection, type PlanComment } from './CommentSection'

const fetchMock = jest.fn()
const realFetch = globalThis.fetch
globalThis.fetch = fetchMock

const existing: PlanComment[] = [
  { id: 'k1', text: 'Can we move the surgery a week later?', createdAt: '2026-10-21T09:30:00.000Z' },
  { id: 'k2', text: 'Is the hotel near the clinic?', createdAt: '2026-10-21T09:45:00.000Z' },
]

const respond = (status: number, body: unknown = {}) =>
  fetchMock.mockResolvedValue({ ok: status >= 200 && status < 300, status, json: async () => body })

const setup = (props: Partial<Parameters<typeof CommentSection>[0]> = {}) => {
  const onPosted = jest.fn()
  render(<CommentSection chatId="c1" status="plan_ready" comments={[]} onPosted={onPosted} {...props} />)
  return { onPosted }
}

const type = (text: string) => fireEvent.change(screen.getByLabelText(/your comments/i), { target: { value: text } })

afterEach(() => fetchMock.mockReset())
afterAll(() => {
  globalThis.fetch = realFetch
})

describe('CommentSection', () => {
  it('shows the form only in plan_ready', () => {
    setup()
    expect(screen.getByLabelText(/your comments/i)).toBeTruthy()
    expect(screen.getByRole('button', { name: /send comments/i })).toBeTruthy()
  })

  it.each(['clarification_review', 'awaiting_payment', 'reservations', 'booked'])('hides the form in %s', (status) => {
    setup({ status, comments: existing })
    expect(screen.queryByLabelText(/your comments/i)).toBeNull()
  })

  it('renders nothing in plan_ready-less states when there are no comments', () => {
    const { onPosted } = setup({ status: 'booked' })
    expect(screen.queryByRole('region', { name: /your comments/i })).toBeNull()
    expect(onPosted).not.toHaveBeenCalled()
  })

  it('lists existing comments oldest first with their times', () => {
    setup({ comments: existing })
    const list = screen.getByRole('list', { name: /previous comments/i })
    const items = within(list).getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0].textContent).toContain('Can we move the surgery a week later?')
    expect(items[1].textContent).toContain('Is the hotel near the clinic?')
    expect(items[0].querySelector('time')?.getAttribute('datetime')).toBe('2026-10-21T09:30:00.000Z')
  })

  it('disables sending while the box is blank', () => {
    setup()
    const button = screen.getByRole('button', { name: /send comments/i }) as HTMLButtonElement
    expect(button.disabled).toBe(true)
    type('   ')
    expect(button.disabled).toBe(true)
    type('hello')
    expect(button.disabled).toBe(false)
  })

  it('limits the text to 4000 characters', () => {
    setup()
    expect(screen.getByLabelText(/your comments/i).getAttribute('maxlength')).toBe('4000')
  })

  it('posts the trimmed text and reports the new status and comment', async () => {
    respond(201, { status: 'clarification_review' })
    const { onPosted } = setup()
    type('  Please add a second option  ')
    fireEvent.click(screen.getByRole('button', { name: /send comments/i }))
    await waitFor(() => expect(onPosted).toHaveBeenCalled())
    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('/api/chats/c1/comments')
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual({ text: 'Please add a second option' })
    expect(onPosted).toHaveBeenCalledWith('clarification_review', expect.objectContaining({ text: 'Please add a second option' }))
  })

  it('disables the button while sending', async () => {
    fetchMock.mockReturnValue(new Promise(() => {}))
    setup()
    type('hi')
    fireEvent.click(screen.getByRole('button', { name: /send comments/i }))
    await waitFor(() => expect((screen.getByRole('button', { name: /sending/i }) as HTMLButtonElement).disabled).toBe(true))
  })

  it('keeps the text and explains a 409', async () => {
    respond(409, { error: 'conflict' })
    const { onPosted } = setup()
    type('hi')
    fireEvent.click(screen.getByRole('button', { name: /send comments/i }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/refresh/i)
    expect((screen.getByLabelText(/your comments/i) as HTMLTextAreaElement).value).toBe('hi')
    expect(onPosted).not.toHaveBeenCalled()
  })

  it('keeps the text and shows an error on a network failure', async () => {
    fetchMock.mockRejectedValue(new Error('offline'))
    setup()
    type('hi')
    fireEvent.click(screen.getByRole('button', { name: /send comments/i }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/could not send/i)
    expect((screen.getByLabelText(/your comments/i) as HTMLTextAreaElement).value).toBe('hi')
  })

  it('clears the box after a successful post', async () => {
    respond(201, { status: 'clarification_review' })
    setup()
    type('hi')
    fireEvent.click(screen.getByRole('button', { name: /send comments/i }))
    await waitFor(() => expect((screen.getByLabelText(/your comments/i) as HTMLTextAreaElement).value).toBe(''))
  })

  it('still succeeds when the 201 body cannot be read', async () => {
    fetchMock.mockResolvedValue({ ok: true, status: 201, json: async () => { throw new SyntaxError() } })
    const { onPosted } = setup()
    type('hi')
    fireEvent.click(screen.getByRole('button', { name: /send comments/i }))
    await waitFor(() => expect(onPosted).toHaveBeenCalledWith('clarification_review', expect.objectContaining({ text: 'hi' })))
    expect(screen.queryByRole('alert')).toBeNull()
  })

  it('asks the patient to sign in again on 401', async () => {
    respond(401, { error: 'unauthorized' })
    setup()
    type('hi')
    fireEvent.click(screen.getByRole('button', { name: /send comments/i }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/sign in again/i)
  })

  it('links the error to the textarea', async () => {
    respond(500)
    setup()
    type('hi')
    fireEvent.click(screen.getByRole('button', { name: /send comments/i }))
    const alert = await screen.findByRole('alert')
    const box = screen.getByLabelText(/your comments/i)
    expect(box.getAttribute('aria-describedby')).toBe(alert.id)
    expect(box.getAttribute('aria-invalid')).toBe('true')
  })
})
