import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn(), replace: jest.fn() }),
}))

const routes = [
  ['login/page', 'Log in: Myrakal', 'Log in'],
  ['forgot-password/page', 'Forgot password: Myrakal', 'Forgot your password?'],
  ['reset-password/page', 'Reset password: Myrakal', 'Choose a new password'],
] as const

const realFetch = globalThis.fetch

afterAll(() => {
  globalThis.fetch = realFetch
})

beforeEach(() => {
  globalThis.fetch = jest.fn(() => new Promise(() => {})) as unknown as typeof fetch
})

describe('portal route skeletons', () => {
  it.each(routes)('%s exports its title and renders a heading', async (route, title, heading) => {
    const page = await import(`./${route}`)
    expect(page.metadata.title).toBe(title)
    const Page = page.default
    render(<Page />)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeTruthy()
  })

  it('centers the login form', async () => {
    const { default: Page } = await import('./login/page')
    render(<Page />)
    expect(screen.getByRole('main').className).toContain('items-center')
    expect(screen.getByRole('main').querySelector('form')?.parentElement?.className).toContain('w-full')
  })
})
