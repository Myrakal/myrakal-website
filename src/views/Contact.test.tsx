import { render, screen } from '@testing-library/react'

import Contact from './Contact'

describe('Contact', () => {
  it('has a single mailto link and one section', () => {
    render(<Contact />)
    const main = screen.getByRole('main')
    const mail = main.querySelectorAll('a[href^="mailto:"]')
    expect(mail).toHaveLength(1)
    expect(mail[0].getAttribute('href')).toContain('mailto:eshaansood@myrakal.com')
    expect(main.querySelectorAll('section')).toHaveLength(2)
  })

  it('keeps the emergency disclaimer', () => {
    render(<Contact />)
    expect(screen.getByText(/not monitored as an emergency or clinical service/i)).toBeTruthy()
  })

  it('offers a copy button and webmail links beside the mailto link', () => {
    render(<Contact />)
    expect(screen.getByRole('button', { name: 'Copy address' }).textContent).toBe('Copy address')
    expect(screen.getByRole('link', { name: 'Open in Gmail' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Open in Outlook' })).toBeTruthy()
  })
})
