import { render, screen } from '@testing-library/react'
import App from '@/App'

describe('App', () => {
  it('renders the home page at /', () => {
    window.history.pushState({}, '', '/')
    render(<App />)
    expect(screen.getAllByRole('heading').length).toBeGreaterThan(0)
  })

  it('has no waitlist or signup form, and every Talk with us link opens the chat', () => {
    window.history.pushState({}, '', '/')
    const { container } = render(<App />)
    expect(container.querySelector('form, input')).toBeNull()
    expect(container.textContent).not.toMatch(/waitlist/i)
    const links = screen.getAllByRole('link', { name: 'Talk with us' })
    expect(links.length).toBeGreaterThan(1)
    for (const link of links) expect(link.getAttribute('href')).toBe('/chat/')
  })

  it('has no For clinics links', () => {
    window.history.pushState({}, '', '/')
    const { container } = render(<App />)
    expect(container.querySelector('a[href*="clinics"]')).toBeNull()
    expect(container.textContent).not.toMatch(/for clinics/i)
  })

  it('no longer serves a clinics page', () => {
    window.history.pushState({}, '', '/clinics/')
    const { container } = render(<App />)
    expect(container.querySelector('h1')?.textContent).toBe('Healthcare, but way cheaper')
  })
})

describe('App chat route', () => {
  it('renders the chat page at /chat/', () => {
    window.history.pushState({}, '', '/chat/')
    render(<App />)
    expect(screen.getByRole('log', { name: 'Conversation' })).toBeTruthy()
  })
})
