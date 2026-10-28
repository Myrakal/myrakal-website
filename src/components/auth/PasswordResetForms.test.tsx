import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush, refresh: mockRefresh }) }))

const mockReset = jest.fn()
const mockUpdate = jest.fn()
const mockUseSession = jest.fn(() => ({ user: { id: 'u1' }, loading: false }))
jest.mock('@/lib/supabase', () => ({
  getSupabase: () => ({ auth: { resetPasswordForEmail: mockReset, updateUser: mockUpdate } }),
}))
jest.mock('@/hooks/useSession', () => ({ useSession: () => mockUseSession() }))

import { ForgotPasswordForm, ResetPasswordForm } from '@/components/auth/PasswordResetForms'

afterEach(() => {
  jest.clearAllMocks()
  mockUseSession.mockReturnValue({ user: { id: 'u1' }, loading: false })
})

describe('ForgotPasswordForm', () => {
  it('requests a reset email that returns to /reset-password and confirms', async () => {
    mockReset.mockResolvedValue({ error: null })
    render(<ForgotPasswordForm />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Email'), 'a@b.co')
    await user.click(screen.getByRole('button', { name: 'Send reset link' }))
    expect(mockReset).toHaveBeenCalledWith('a@b.co', { redirectTo: `${window.location.origin}/reset-password` })
    expect((await screen.findByRole('status')).textContent).toContain('Check your email')
  })

  it('shows an error when the request fails', async () => {
    mockReset.mockResolvedValue({ error: { message: 'Rate limit exceeded' } })
    render(<ForgotPasswordForm />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Email'), 'a@b.co')
    await user.click(screen.getByRole('button', { name: 'Send reset link' }))
    expect((await screen.findByRole('alert')).textContent).toContain('Rate limit exceeded')
  })

  it('shows an error and re-enables the button when the request throws', async () => {
    mockReset.mockRejectedValue(new Error('network'))
    render(<ForgotPasswordForm />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Email'), 'a@b.co')
    await user.click(screen.getByRole('button', { name: 'Send reset link' }))
    expect((await screen.findByRole('alert')).textContent).toContain('Something went wrong')
    expect((screen.getByRole('button', { name: 'Send reset link' }) as HTMLButtonElement).disabled).toBe(false)
  })
})

describe('ForgotPasswordForm retries', () => {
  it('stays disabled after a successful request', async () => {
    mockReset.mockResolvedValue({ error: null })
    render(<ForgotPasswordForm />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('Email'), 'a@b.co')
    await user.click(screen.getByRole('button', { name: 'Send reset link' }))
    await screen.findByText(/Check your email/)
    expect((screen.getByRole('button', { name: 'Send reset link' }) as HTMLButtonElement).disabled).toBe(true)
    expect(mockReset).toHaveBeenCalledTimes(1)
  })
})

describe('ResetPasswordForm', () => {
  it('sets the new password and goes to the dashboard', async () => {
    mockUpdate.mockResolvedValue({ error: null })
    render(<ResetPasswordForm />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('New password'), 'brand-new-pw')
    await user.click(screen.getByRole('button', { name: 'Save new password' }))
    expect(mockUpdate).toHaveBeenCalledWith({ password: 'brand-new-pw' })
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'))
  })

  it('shows the update error', async () => {
    mockUpdate.mockResolvedValue({ error: { message: 'Password is too weak' } })
    render(<ResetPasswordForm />)
    const user = userEvent.setup()
    await user.type(screen.getByLabelText('New password'), 'brand-new-pw')
    await user.click(screen.getByRole('button', { name: 'Save new password' }))
    expect((await screen.findByRole('alert')).textContent).toContain('Password is too weak')
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('tells visitors without a recovery session to request a new link', () => {
    mockUseSession.mockReturnValue({ user: null as never, loading: false })
    render(<ResetPasswordForm />)
    expect(screen.queryByLabelText('New password')).toBeNull()
    expect(screen.getByRole('link', { name: /new reset link/i }).getAttribute('href')).toBe('/forgot-password')
  })
})

describe('reset form styling', () => {
  it('uses the square gold-outlined landing styling', () => {
    render(<ForgotPasswordForm />)
    const submit = screen.getByRole('button', { name: 'Send reset link' })
    expect(submit.className).toContain('border-champagne')
    expect(submit.className).not.toContain('rounded')
    expect(screen.getByLabelText('Email').className).toContain('border-champagne')
  })
})
