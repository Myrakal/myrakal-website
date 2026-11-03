import { act, render, screen } from '@testing-library/react'


let mockReduceMotion = false
jest.mock('motion/react', () => ({ ...jest.requireActual('motion/react'), useReducedMotion: () => mockReduceMotion }))

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
    mockReduceMotion = false
  })

  it('opens the contact form from Talk with us', () => {
    render(<Navbar />)
    expect(screen.getByRole('button', { name: /^Talk with us/ })).toBeInTheDocument()
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

  it('shows the tagline at full size straight away when the visitor prefers reduced motion', () => {
    mockReduceMotion = true
    render(<Navbar />)
    scrollTo(200)
    const tagline = screen.getByText('Healthcare, as it should be')
    expect(tagline.style.width).not.toBe('0px')
    expect(tagline.style.opacity).not.toBe('0')
  })

  it('hides the scrolled tagline on phones so it cannot collide with the actions', () => {
    render(<Navbar />)
    scrollTo(200)
    const classes = screen.getByText('Healthcare, as it should be').className.split(' ')
    expect(classes).toContain('hidden')
    expect(classes).toContain('sm:inline-block')
  })
})
