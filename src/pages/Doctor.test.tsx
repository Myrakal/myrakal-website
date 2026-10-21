import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Doctor from '@/pages/Doctor'

const intakes = [
  {
    id: 'a',
    consultStatus: 'in_review',
    paidAt: '2026-10-20T16:00:00.000Z',
    consultNote: null,
    reviewedAt: null,
    createdAt: '2026-10-20T15:00:00.000Z',
    name: 'Ada Lovelace',
    email: 'ada@example.com',
    transcript: [
      { role: 'assistant', text: 'Hi, do you already have a diagnosis?' },
      { role: 'user', text: 'Knee pain for a month' },
      { role: 'assistant', text: 'Do you have any recent labs, imaging, or other tests?' },
      { role: 'user', text: 'X-ray in March' },
      { role: 'assistant', text: 'What insurance plan do you have, if any?' },
      { role: 'user', text: 'Aetna PPO' },
    ],
  },
  { id: 'b', consultStatus: 'awaiting_payment', paidAt: null, consultNote: null, reviewedAt: null, createdAt: '2026-10-19T15:00:00.000Z', name: null, email: 'grace@example.com', transcript: [] },
]

const section = (name: string) => within(screen.getByRole('heading', { name }).parentElement!)

const signIn = async (token = 'secret-token') => {
  const user = userEvent.setup()
  render(<Doctor />)
  await user.type(screen.getByLabelText('Access token'), token)
  await user.click(screen.getByRole('button', { name: 'View patients' }))
  return user
}

describe('Doctor page', () => {
  beforeEach(() => {
    sessionStorage.clear()
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, status: 200, json: async () => intakes }))
  })
  afterEach(() => vi.unstubAllGlobals())

  it('asks for a token and fetches nothing before it is entered', () => {
    render(<Doctor />)
    expect(screen.getByLabelText('Access token')).toBeTruthy()
    expect(fetch).not.toHaveBeenCalled()
  })

  it('sends the token as a bearer header', async () => {
    await signIn()
    await waitFor(() => expect(fetch).toHaveBeenCalled())
    expect(vi.mocked(fetch).mock.calls[0][1]).toMatchObject({ headers: { authorization: 'Bearer secret-token' } })
  })

  it('lists patients and shows the first one’s case by default', async () => {
    await signIn()
    expect(await screen.findByRole('button', { name: /Ada Lovelace/ })).toBeTruthy()
    expect(screen.getByRole('button', { name: /grace@example.com/ })).toBeTruthy()
    expect(section('Symptoms and history').getByText('Knee pain for a month')).toBeTruthy()
    expect(section('Labs and imaging').getByText('X-ray in March')).toBeTruthy()
    expect(section('Insurance').getByText('Aetna PPO')).toBeTruthy()
  })

  it('switches to another patient and shows a placeholder for missing answers', async () => {
    const user = await signIn()
    await user.click(await screen.findByRole('button', { name: /grace@example.com/ }))
    expect(screen.queryByText('Knee pain for a month')).toBeNull()
    expect(screen.getAllByText('Not provided').length).toBe(3)
  })

  it('shows the full transcript on request', async () => {
    const user = await signIn()
    await screen.findByRole('heading', { name: 'Insurance' })
    const details = screen.getByText('Full conversation').closest('details')!
    expect(details.open).toBe(false)
    await user.click(screen.getByText('Full conversation'))
    expect(details.open).toBe(true)
    expect(within(details).getByText(/Hi, do you already have a diagnosis\?/)).toBeTruthy()
  })

  it('collapses the full conversation when switching patients', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [intakes[0], { ...intakes[0], id: 'c', name: 'Alan Turing' }],
    } as Response)
    const user = await signIn()
    await screen.findByRole('heading', { name: 'Insurance' })
    await user.click(screen.getByText('Full conversation'))
    await user.click(screen.getByRole('button', { name: /Alan Turing/ }))
    expect((screen.getByText('Full conversation').closest('details') as HTMLDetailsElement).open).toBe(false)
  })

  it('shows an error instead of crashing on a malformed response', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, status: 200, json: async () => ({ oops: true }) } as Response)
    await signIn()
    expect(await screen.findByRole('alert')).toBeTruthy()
  })

  it('shows an error and keeps the form on a bad token', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: false, status: 401, json: async () => ({}) } as Response)
    await signIn('wrong')
    expect((await screen.findByRole('alert')).textContent).toMatch(/token/i)
    expect(screen.getByLabelText('Access token')).toBeTruthy()
  })

  it('shows an empty state with no intakes', async () => {
    vi.mocked(fetch).mockResolvedValue({ ok: true, status: 200, json: async () => [] } as Response)
    await signIn()
    expect(await screen.findByText(/no patients yet/i)).toBeTruthy()
  })

  it('shows a status label per patient and a badge for the open case', async () => {
    await signIn()
    expect(within(await screen.findByRole('button', { name: /Ada Lovelace/ })).getByText('In review')).toBeTruthy()
    expect(within(screen.getByRole('button', { name: /grace@example.com/ })).getByText('Awaiting payment')).toBeTruthy()
    expect(screen.getByRole('status').textContent).toMatch(/in review/i)
  })

  it('offers decision controls only while in review', async () => {
    const user = await signIn()
    expect(await screen.findByRole('button', { name: 'Approve' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Request changes' })).toBeTruthy()
    await user.click(screen.getByRole('button', { name: /grace@example.com/ }))
    expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull()
    expect(screen.queryByLabelText('Note to patient')).toBeNull()
  })

  it('posts the decision with the token and updates the case and list', async () => {
    const user = await signIn()
    await user.type(await screen.findByLabelText('Note to patient'), '  Get an MRI first ')
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: 'a', consultStatus: 'changes_requested', consultNote: 'Get an MRI first', reviewedAt: '2026-10-20T17:00:00.000Z' }),
    } as Response)
    await user.click(screen.getByRole('button', { name: 'Request changes' }))
    const call = vi.mocked(fetch).mock.calls[1]
    expect(call[0]).toBe('/api/intakes')
    expect(call[1]).toMatchObject({ method: 'POST', headers: { authorization: 'Bearer secret-token' } })
    expect(JSON.parse(call[1]!.body as string)).toEqual({ id: 'a', decision: 'changes_requested', note: 'Get an MRI first' })
    await waitFor(() => expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull())
    expect(screen.getByRole('status').textContent).toMatch(/changes requested/i)
    expect(screen.getByRole('status').textContent).toContain('Get an MRI first')
    expect(within(screen.getByRole('button', { name: /Ada Lovelace/ })).getByText('Changes requested')).toBeTruthy()
  })

  it('shows decided cases with their note and no controls', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ ...intakes[0], consultStatus: 'approved', consultNote: 'Looks good', reviewedAt: '2026-10-20T17:00:00.000Z' }],
    } as Response)
    await signIn()
    expect((await screen.findByRole('status')).textContent).toContain('Looks good')
    expect(screen.queryByRole('button', { name: 'Approve' })).toBeNull()
  })

  it('shows an error and keeps the controls when the decision fails', async () => {
    const user = await signIn()
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status: 409, json: async () => ({}) } as Response)
    await user.click(await screen.findByRole('button', { name: 'Approve' }))
    expect((await screen.findByRole('alert')).textContent).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Approve' })).toBeTruthy()
  })

  it('requires a note to request changes', async () => {
    const user = await signIn()
    await user.click(await screen.findByRole('button', { name: 'Request changes' }))
    expect((await screen.findByRole('alert')).textContent).toMatch(/note/i)
    expect(fetch).toHaveBeenCalledTimes(1)
  })

  it.each([
    [401, /reload and sign in again/i],
    [404, /could not be found/i],
    [409, /no longer awaiting review/i],
    [500, /could not save/i],
  ])('explains a %i from the decision endpoint', async (status, message) => {
    const user = await signIn()
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, status, json: async () => ({}) } as Response)
    await user.click(await screen.findByRole('button', { name: 'Approve' }))
    expect((await screen.findByRole('alert')).textContent).toMatch(message)
  })

  it('keeps drafted notes per patient when switching', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [intakes[0], { ...intakes[0], id: 'c', name: 'Alan Turing' }],
    } as Response)
    const user = await signIn()
    await user.type(await screen.findByLabelText('Note to patient'), 'for Ada')
    await user.click(screen.getByRole('button', { name: /Alan Turing/ }))
    expect((screen.getByLabelText('Note to patient') as HTMLTextAreaElement).value).toBe('')
    await user.type(screen.getByLabelText('Note to patient'), 'for Alan')
    await user.click(screen.getByRole('button', { name: /Ada Lovelace/ }))
    expect((screen.getByLabelText('Note to patient') as HTMLTextAreaElement).value).toBe('for Ada')
    await user.click(screen.getByRole('button', { name: /Alan Turing/ }))
    expect((screen.getByLabelText('Note to patient') as HTMLTextAreaElement).value).toBe('for Alan')
  })

  it('applies a late decision to the patient it was for, not the one on screen', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => [intakes[0], { ...intakes[0], id: 'c', name: 'Alan Turing' }],
    } as Response)
    const user = await signIn()
    let finish!: (r: Response) => void
    vi.mocked(fetch).mockReturnValueOnce(new Promise<Response>((r) => (finish = r)))
    await user.click(await screen.findByRole('button', { name: 'Approve' }))
    await user.click(screen.getByRole('button', { name: /Alan Turing/ }))
    finish({ ok: true, status: 200, json: async () => ({ id: 'a', consultStatus: 'approved', consultNote: null, reviewedAt: '2026-10-20T17:00:00.000Z' }) } as Response)
    await waitFor(() => expect(within(screen.getByRole('button', { name: /Ada Lovelace/ })).getByText('Approved')).toBeTruthy())
    expect(within(screen.getByRole('button', { name: /Alan Turing/ })).getByText('In review')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Approve' })).toBeTruthy()
  })
})
