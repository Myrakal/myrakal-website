import { act, render, screen } from '@testing-library/react'
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
    expect(screen.getByText('Healthcare, but way cheaper')).toBeTruthy()
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
})
