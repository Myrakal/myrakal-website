import { TALK_WITH_US_HREF } from '@/lib/contact'
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

  it('points Talk with us at a prefilled email', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /^Talk with us/ }).getAttribute('href')).toBe(TALK_WITH_US_HREF)
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

  it('turns solid ink once scrolled', () => {
    const { container } = render(<Navbar />)
    scrollTo(200)
    expect(container.querySelector('header')!.className).toMatch(/bg-ink/)
  })

  it('shows Care, Individual and Business before Talk with us', () => {
    render(<Navbar />)
    const nav = screen.getByRole('navigation', { name: 'Primary' })
    const items = [...nav.querySelectorAll('a, button')].map((el) => el.textContent)
    expect(items).toEqual(['Care', 'Individual', 'Business'])
    const order = [...nav.parentElement!.querySelectorAll('nav, a[href^="mailto:"]')]
    expect(order[0]).toBe(nav)
    expect(screen.getByRole('link', { name: /^Talk with us/ })).toBeTruthy()
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

  it('keeps the logo at the left edge at every width, scrolled or not', () => {
    render(<Navbar />)
    const banner = screen.getByRole('banner')
    expect(banner.className.split(' ')).toContain('justify-start')
    expect(banner.className).not.toMatch(/justify-center/)
    scrollTo(200)
    expect(banner.className.split(' ')).toContain('justify-start')
    expect(banner.className).not.toMatch(/justify-center/)
  })

  it('expands the tagline from the logo only once the page scrolls', () => {
    render(<Navbar />)
    expect(screen.queryByText('Healthcare, as it should be')).toBeNull()
    scrollTo(200)
    const tagline = screen.getByText('Healthcare, as it should be')
    expect(tagline.style.width).toBe('0px')
    expect(tagline.style.opacity).toBe('0')
    expect(tagline.className).toMatch(/truncate/)
  })

  it('hides the scrolled tagline on phones so it cannot collide with the actions', () => {
    render(<Navbar />)
    scrollTo(200)
    const classes = screen.getByText('Healthcare, as it should be').className.split(' ')
    expect(classes).toContain('hidden')
    expect(classes).toContain('sm:inline-block')
  })
})
