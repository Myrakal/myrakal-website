import { render, screen } from '@testing-library/react'

import AccessibilityPage, { metadata } from '@/app/accessibility/page'
import { CONTACT_EMAIL } from '@/lib/contact'

describe('accessibility statement', () => {
  it('has its own canonical URL and title', () => {
    expect(metadata.alternates?.canonical).toBe('/accessibility')
    expect(String(metadata.title)).toMatch(/accessibility/i)
  })

  it('states the WCAG target, known limits and how to report a barrier', () => {
    const { container } = render(<AccessibilityPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Accessibility' })).toBeInTheDocument()
    const text = container.textContent ?? ''
    expect(text).toMatch(/WCAG 2\.2/)
    expect(text).toMatch(/AA/)
    expect(text).toMatch(/quote form/i)
    expect(text).not.toMatch(/\bAI\b|licensed doctor|intake/i)
    expect(text).not.toContain('—')
    expect(screen.getAllByRole('link', { name: CONTACT_EMAIL })[0]).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}?subject=Accessibility%20support`)
    expect(screen.getByText(/Last updated/)).toHaveTextContent('November 10, 2026')
  })
})
