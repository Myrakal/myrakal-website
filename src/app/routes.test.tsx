import { render, screen } from '@testing-library/react'

jest.mock('@/hooks/useSession', () => ({ useSession: () => ({ user: null, loading: false }) }))
jest.mock('@/lib/supabase', () => ({ getSupabase: () => null }))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

const routes = [
  ['privacy', 'Privacy Policy: Myrakal'],
  ['terms', 'Terms of Service: Myrakal'],
  ['contact', 'Contact: Myrakal'],
  ['accessibility', 'Accessibility: Myrakal'],
  ['chat', 'Chat: Myrakal'],
  ['care', 'Care: Myrakal'],
  ['individual', 'Individual: Myrakal'],
] as const

describe('app routes', () => {
  it.each(routes)('/%s exports its title and renders', async (route, title) => {
    const page = await import(`./${route}/page`)
    expect(page.metadata.title).toBe(title)
    const Page = page.default
    render(<Page />)
    expect(screen.getAllByRole('link').length).toBeGreaterThan(0)
  })

  it('not-found renders a heading and a way home', async () => {
    const { default: NotFound } = await import('./not-found')
    render(<NotFound />)
    expect(screen.getByRole('heading', { level: 1 })).toBeTruthy()
    expect(screen.getByRole('link', { name: /home/i }).getAttribute('href')).toBe('/')
  })
})
