import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import Doctor from '@/pages/Doctor'

const intakes = [
  {
    id: 'a',
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
  { id: 'b', createdAt: '2026-10-19T15:00:00.000Z', name: null, email: 'grace@example.com', transcript: [] },
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
})
