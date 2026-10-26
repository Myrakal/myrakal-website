import { act, fireEvent, render, screen } from '@testing-library/react'

const mockSignOut = jest.fn(() => Promise.resolve({ error: null }))
const mockUseSession = jest.fn(() => ({ user: null, loading: false }))
jest.mock('@/hooks/useSession', () => ({ useSession: () => mockUseSession() }))
jest.mock('@/lib/supabase', () => ({ getSupabase: () => ({ auth: { signOut: mockSignOut } }) }))

let mockPathname = '/'
jest.mock('next/navigation', () => ({ usePathname: () => mockPathname }))

import { Navbar } from '@/components/Navbar'

const scrollTo = (y: number) =>
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
    window.dispatchEvent(new Event('scroll'))
  })

describe('Navbar', () => {
  afterEach(() => {
    scrollTo(0)
    jest.clearAllMocks()
    mockSignOut.mockResolvedValue({ error: null })
    mockUseSession.mockReturnValue({ user: null, loading: false })
    mockPathname = '/'
  })

  it('offers log in to signed-out visitors', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: 'Log in' }).getAttribute('href')).toBe('/login')
    expect(screen.queryByRole('button', { name: 'Log out' })).toBeNull()
  })

  it('offers the dashboard and log out to signed-in users', () => {
    mockUseSession.mockReturnValue({ user: { id: 'u1' } as never, loading: false })
    render(<Navbar />)
    expect(screen.getByRole('link', { name: 'Dashboard' }).getAttribute('href')).toBe('/dashboard')
    expect(screen.queryByRole('link', { name: 'Log in' })).toBeNull()
    fireEvent.click(screen.getByRole('button', { name: 'Log out' }))
    expect(mockSignOut).toHaveBeenCalled()
  })

  it('shows no auth link while the session is loading', () => {
    mockUseSession.mockReturnValue({ user: null, loading: true })
    render(<Navbar />)
    expect(screen.queryByRole('link', { name: 'Log in' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Log out' })).toBeNull()
  })

  it('links Care to the care page', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: 'Care' }).getAttribute('href')).toBe('/care')
  })

  it('marks Care as the current page only on the care page', () => {
    const { unmount } = render(<Navbar />)
    expect(screen.getByRole('link', { name: 'Care' }).getAttribute('aria-current')).toBeNull()
    unmount()
    mockPathname = '/care'
    render(<Navbar />)
    expect(screen.getByRole('link', { name: 'Care' }).getAttribute('aria-current')).toBe('page')
    mockPathname = '/'
  })

  it('keeps Talk with us pointed at the dashboard', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: 'Talk with us' }).getAttribute('href')).toBe('/dashboard')
  })

  it('shows the new tagline after scrolling', () => {
    render(<Navbar />)
    scrollTo(200)
    expect(screen.getByText('Healthcare, as it should be')).toBeTruthy()
    expect(screen.queryByText(/cross-border/i)).toBeNull()
  })

  it('stays transparent and leaves the wordmark to the hero before scrolling', () => {
    const { container } = render(<Navbar />)
    expect(container.querySelector('header')!.className).toMatch(/bg-transparent/)
    expect(container.querySelector('img[src*="myrakal-wordmark"]')).toBeNull()
    expect(screen.getByRole('link', { name: 'Myrakal home' })).toBeTruthy()
  })

  it('turns solid once scrolled', () => {
    const { container } = render(<Navbar />)
    scrollTo(200)
    expect(container.querySelector('header')!.className).toMatch(/bg-background/)
  })

  it('shows Care, Individual and Business before Talk with us', () => {
    render(<Navbar />)
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    const items = [...nav.querySelectorAll('a, button')].map((el) => el.textContent)
    expect(items).toEqual(['Care', 'Individual', 'Business'])
    const order = [...nav.parentElement!.querySelectorAll('nav, a[href="/dashboard"]')]
    expect(order[0]).toBe(nav)
    expect(screen.getByRole('link', { name: 'Talk with us' })).toBeTruthy()
  })

  it.each([
    ['Care', '/care'],
    ['Individual', '/individual'],
    ['Business', '/business'],
  ])('links %s to its page and marks it current only there', (name, href) => {
    const { unmount } = render(<Navbar />)
    expect(screen.getByRole('link', { name }).getAttribute('href')).toBe(href)
    expect(screen.getByRole('link', { name }).getAttribute('aria-current')).toBeNull()
    unmount()
    mockPathname = href
    render(<Navbar />)
    expect(screen.getByRole('link', { name }).getAttribute('aria-current')).toBe('page')
    mockPathname = '/'
  })
})
