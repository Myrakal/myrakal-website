import { render, screen } from '@testing-library/react'

import PrivacyPage, { metadata } from '@/app/privacy/page'
import { CONTACT_EMAIL } from '@/lib/contact'

describe('privacy policy', () => {
  it('has its own canonical URL and title', () => {
    expect(metadata.alternates?.canonical).toBe('/privacy')
    expect(String(metadata.title)).toMatch(/privacy/i)
  })

  it('describes the quote form, the providers that process it and how to make a request', () => {
    const { container } = render(<PrivacyPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeInTheDocument()
    const text = container.textContent ?? ''
    for (const provider of ['Vercel', 'Formspree', 'PostHog', 'Google Fonts']) expect(text).toContain(provider)
    expect(text).toMatch(/quote form/i)
    expect(text).toMatch(/do not sell/i)
    expect(text).not.toMatch(/\bAI\b|licensed doctor|intake/i)
    expect(screen.getAllByRole('link', { name: CONTACT_EMAIL })[0]).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}?subject=Privacy%20request`)
    expect(screen.getByText(/Last updated/)).toHaveTextContent('November 10, 2026')
  })
})
