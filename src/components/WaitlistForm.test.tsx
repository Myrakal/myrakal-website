import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import { WaitlistForm } from '@/components/WaitlistForm'
import { track } from '@/lib/analytics'

vi.mock('@/lib/analytics', () => ({ track: vi.fn() }))

const submit = vi.fn()
let succeeded = false
vi.mock('@formspree/react', () => ({
  useForm: () => [{ succeeded, submitting: false }, submit],
}))

describe('WaitlistForm funnel events', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    succeeded = false
  })

  it('tracks focus once, however many times fields are focused', async () => {
    const user = userEvent.setup()
    render(<WaitlistForm />)
    await user.click(screen.getByPlaceholderText('Name'))
    await user.click(screen.getByPlaceholderText('Email'))
    expect(vi.mocked(track).mock.calls).toEqual([['waitlist_focus']])
  })

  it('tracks typing once, not per keystroke', async () => {
    const user = userEvent.setup()
    render(<WaitlistForm />)
    await user.type(screen.getByPlaceholderText('Name'), 'Ada')
    await user.type(screen.getByPlaceholderText('Email'), 'ada@x.com')
    expect(vi.mocked(track).mock.calls).toEqual([['waitlist_focus'], ['waitlist_type']])
  })

  it('tracks submit when the form is submitted', async () => {
    const user = userEvent.setup()
    render(<WaitlistForm />)
    await user.type(screen.getByPlaceholderText('Name'), 'Ada')
    await user.type(screen.getByPlaceholderText('Email'), 'ada@x.com')
    await user.click(screen.getByRole('button', { name: 'Talk with us' }))
    expect(track).toHaveBeenLastCalledWith('waitlist_submit')
    expect(submit).toHaveBeenCalled()
  })

  it('tracks success once the submission succeeds', () => {
    succeeded = true
    render(<WaitlistForm />)
    expect(track).toHaveBeenCalledWith('waitlist_success')
  })

  it('has no waitlist copy and a short call to action', () => {
    render(<WaitlistForm />)
    expect(screen.getByRole('button', { name: 'Talk with us' })).toBeTruthy()
    expect(screen.queryByText(/waitlist/i)).toBeNull()
  })

  it('confirms the team will be in touch after success', () => {
    succeeded = true
    render(<WaitlistForm />)
    const text = screen.getByRole('status').textContent ?? ''
    expect(text).toMatch(/in touch/i)
    expect(text).not.toMatch(/list/i)
  })
})
