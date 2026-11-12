import { fireEvent, render, screen, waitFor } from '@testing-library/react'

const login = jest.fn()
jest.mock('./actions', () => ({ login: (...args: unknown[]) => login(...args) }))

describe('LoginForm', () => {
  it('refocuses the password input after a failed login', async () => {
    login.mockResolvedValue({ error: 'Incorrect password' })
    const { LoginForm } = await import('./LoginForm')
    render(<LoginForm />)
    const input = screen.getByLabelText(/password/i)
    fireEvent.change(input, { target: { value: 'nope' } })
    const button = screen.getByRole('button', { name: /enter/i })
    button.focus()
    fireEvent.click(button)
    await screen.findByRole('alert')
    await waitFor(() => expect(document.activeElement).toBe(input))
  })
})
