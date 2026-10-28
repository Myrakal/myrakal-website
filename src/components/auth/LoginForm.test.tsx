import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockPush = jest.fn()
const mockRefresh = jest.fn()
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: mockPush, refresh: mockRefresh }) }))

const mockSignIn = jest.fn()
const mockSignUp = jest.fn()
const mockUseSession = jest.fn(() => ({ user: null, loading: false }))
jest.mock('@/lib/supabase', () => ({
  getSupabase: () => ({ auth: { signInWithPassword: mockSignIn, signUp: mockSignUp } }),
}))
jest.mock('@/hooks/useSession', () => ({ useSession: () => mockUseSession() }))

import { LoginForm } from '@/components/auth/LoginForm'

const fill = async (email = 'a@b.co', password = 'hunter22') => {
  const user = userEvent.setup()
  await user.type(screen.getByLabelText('Email'), email)
  await user.type(screen.getByLabelText('Password'), password)
  return user
}

afterEach(() => {
  jest.clearAllMocks()
  mockUseSession.mockReturnValue({ user: null, loading: false })
})

describe('LoginForm', () => {
  it('signs in with email and password and goes to the dashboard', async () => {
    mockSignIn.mockResolvedValue({ data: { session: {} }, error: null })
    render(<LoginForm />)
    const user = await fill()
    await user.click(screen.getByRole('button', { name: 'Log in' }))
    expect(mockSignIn).toHaveBeenCalledWith({ email: 'a@b.co', password: 'hunter22' })
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'))
    expect(mockRefresh).toHaveBeenCalled()
  })

  it('shows the error and stays put when sign in fails', async () => {
    mockSignIn.mockResolvedValue({ data: { session: null }, error: { message: 'Invalid login credentials' } })
    render(<LoginForm />)
    const user = await fill()
    await user.click(screen.getByRole('button', { name: 'Log in' }))
    expect((await screen.findByRole('alert')).textContent).toContain('Invalid login credentials')
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('switches to sign up and creates an account', async () => {
    mockSignUp.mockResolvedValue({ data: { session: {} }, error: null })
    render(<LoginForm />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Create an account' }))
    expect(screen.getByRole('heading', { name: 'Create your account' })).toBeTruthy()
    const user = await fill()
    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    expect(mockSignUp).toHaveBeenCalledWith({ email: 'a@b.co', password: 'hunter22' })
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'))
  })

  it('asks the user to confirm their email when sign up returns no session', async () => {
    mockSignUp.mockResolvedValue({ data: { session: null }, error: null })
    render(<LoginForm />)
    await userEvent.setup().click(screen.getByRole('button', { name: 'Create an account' }))
    const user = await fill()
    await user.click(screen.getByRole('button', { name: 'Sign up' }))
    expect((await screen.findByRole('status')).textContent).toContain('Check your email')
    expect(mockSignIn).not.toHaveBeenCalled()
    expect(mockPush).not.toHaveBeenCalled()
  })

  it('re-enables the form and shows an error when the request throws', async () => {
    mockSignIn.mockRejectedValue(new Error('network'))
    render(<LoginForm />)
    const user = await fill()
    await user.click(screen.getByRole('button', { name: 'Log in' }))
    expect((await screen.findByRole('alert')).textContent).toContain('Something went wrong')
    expect((screen.getByRole('button', { name: 'Log in' }) as HTMLButtonElement).disabled).toBe(false)
  })

  it('navigates once when sign in also updates the session', async () => {
    mockSignIn.mockResolvedValue({ data: { session: {} }, error: null })
    const { rerender } = render(<LoginForm />)
    const user = await fill()
    await user.click(screen.getByRole('button', { name: 'Log in' }))
    mockUseSession.mockReturnValue({ user: { id: 'u1' } as never, loading: false })
    rerender(<LoginForm />)
    await waitFor(() => expect(mockPush).toHaveBeenCalledTimes(1))
  })

  it('disables the submit button while the request is in flight', async () => {
    mockSignIn.mockReturnValue(new Promise(() => {}))
    render(<LoginForm />)
    const user = await fill()
    await user.click(screen.getByRole('button', { name: 'Log in' }))
    expect((screen.getByRole('button', { name: /please wait/i }) as HTMLButtonElement).disabled).toBe(true)
  })

  it('requires a password of at least 8 characters', () => {
    render(<LoginForm />)
    expect(screen.getByLabelText('Password').getAttribute('minlength')).toBe('8')
  })

  it('redirects an already signed-in user to the dashboard', async () => {
    mockUseSession.mockReturnValue({ user: { id: 'u1' } as never, loading: false })
    render(<LoginForm />)
    await waitFor(() => expect(mockPush).toHaveBeenCalledWith('/dashboard'))
  })

  it('links to the forgot password page', () => {
    render(<LoginForm />)
    expect(screen.getByRole('link', { name: 'Forgot password?' }).getAttribute('href')).toBe('/forgot-password')
  })

  it('uses the square gold-outlined landing styling', () => {
    render(<LoginForm />)
    const submit = screen.getByRole('button', { name: 'Log in' })
    expect(submit.className).toContain('border-champagne')
    expect(submit.className).not.toContain('rounded')
    const input = screen.getByLabelText('Email')
    expect(input.className).toContain('border-champagne')
    expect(input.className).not.toContain('rounded')
    expect(screen.getByRole('heading', { name: 'Welcome back' }).className).toContain('italic')
  })
})
