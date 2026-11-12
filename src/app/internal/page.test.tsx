import { render, screen } from '@testing-library/react'

const isAuthed = jest.fn()
jest.mock('@/lib/internal-auth', () => ({ isAuthed: () => isAuthed() }))
jest.mock('./actions', () => ({ login: jest.fn(), logout: jest.fn() }))

describe('/internal page', () => {
  it('shows the password form when not authed', async () => {
    isAuthed.mockResolvedValue(false)
    const { default: Page } = await import('./page')
    render(await Page())
    expect(screen.getByLabelText(/password/i)).toBeTruthy()
    expect(screen.queryByRole('button', { name: /sign out/i })).toBeNull()
  })

  it('shows the tool when authed', async () => {
    isAuthed.mockResolvedValue(true)
    const { default: Page } = await import('./page')
    render(await Page())
    expect(screen.queryByLabelText(/password/i)).toBeNull()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeTruthy()
  })

  it('is not indexable', async () => {
    const { metadata } = await import('./page')
    expect(metadata.robots).toEqual({ index: false })
  })
})
