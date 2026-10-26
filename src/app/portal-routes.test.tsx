import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  useParams: () => ({ id: '3f1c2b4a-0000-4000-8000-000000000001' }),
  useRouter: () => ({ push: jest.fn(), refresh: jest.fn(), replace: jest.fn() }),
}))

const routes = [
  ['login/page', 'Log in: Myrakal', 'Log in'],
  ['forgot-password/page', 'Forgot password: Myrakal', 'Forgot your password?'],
  ['reset-password/page', 'Reset password: Myrakal', 'Choose a new password'],
  ['chats/[id]/page', 'Your case: Myrakal', 'Your case'],
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

  it('chat portal fetches the chat named in the route params', async () => {
    const { default: Page } = await import('./chats/[id]/page')
    render(<Page />)
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/chats/3f1c2b4a-0000-4000-8000-000000000001', expect.anything())
  })
})
