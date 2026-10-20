import { render, screen } from '@testing-library/react'
import App from '@/App'

describe('App', () => {
  it('renders the home page at /', () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getAllByRole('heading').length).toBeGreaterThan(0)
  })

  it('has no waitlist or signup form, and every Talk with us link goes to the contact page', () => {
    window.history.pushState({}, '', '/')
    const { container } = render(<App />)
    expect(container.querySelector('form, input')).toBeNull()
    expect(container.textContent).not.toMatch(/waitlist/i)
    const links = screen.getAllByRole('link', { name: 'Talk with us' })
    expect(links.length).toBeGreaterThan(1)
    for (const link of links) expect(link.getAttribute('href')).toBe('/contact/')
  })
})
