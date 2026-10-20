import { act, render, screen } from '@testing-library/react'
import { Navbar } from '@/components/Navbar'

describe('Navbar', () => {
  it('shows the new tagline after scrolling', () => {
    render(<Navbar />)
    act(() => {
      Object.defineProperty(window, 'scrollY', { value: 200, configurable: true })
      window.dispatchEvent(new Event('scroll'))
    })
    expect(screen.getByText('Healthcare, but way cheaper')).toBeTruthy()
    expect(screen.queryByText(/cross-border/i)).toBeNull()
  })
})
