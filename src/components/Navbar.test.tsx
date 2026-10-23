import { act, fireEvent, render, screen, within } from '@testing-library/react'
import { Navbar } from '@/components/Navbar'

const scrollTo = (y: number) =>
  act(() => {
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true })
    window.dispatchEvent(new Event('scroll'))
  })

describe('Navbar', () => {
  afterEach(() => scrollTo(0))

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
    const items = within(nav).getAllByRole('button').map((el) => el.textContent)
    expect(items).toEqual(['Care', 'Individual', 'Business'])
    const order = [...nav.parentElement!.querySelectorAll('nav, a[href="/chat/"]')]
    expect(order[0]).toBe(nav)
    expect(screen.getByRole('link', { name: 'Talk with us' })).toBeTruthy()
  })

  it('does nothing when the new items are clicked', () => {
    render(<Navbar />)
    const before = window.location.href
    for (const name of ['Care', 'Individual', 'Business']) fireEvent.click(screen.getByRole('button', { name }))
    expect(window.location.href).toBe(before)
  })
})
