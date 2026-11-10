import { render, screen } from '@testing-library/react'

import TermsPage, { metadata } from '@/app/terms/page'
import { CONTACT_EMAIL } from '@/lib/contact'

describe('terms of service', () => {
  it('has its own canonical URL and title', () => {
    expect(metadata.alternates?.canonical).toBe('/terms')
    expect(String(metadata.title)).toMatch(/terms/i)
  })

  it('describes the free comparison, the coordination fee, independent providers and Illinois law', () => {
    const { container } = render(<TermsPage />)
    expect(screen.getByRole('heading', { level: 1, name: 'Terms of Service' })).toBeInTheDocument()
    const text = container.textContent ?? ''
    expect(text).toMatch(/coordination fee/i)
    expect(text).toMatch(/never take money from clinics/i)
    expect(text).toMatch(/not a healthcare provider/i)
    expect(text).toMatch(/Illinois/)
    expect(text).not.toMatch(/\bAI\b|licensed doctor|intake/i)
    expect(text).not.toContain('—')
    expect(screen.getByRole('link', { name: /verifying a dentist or surgeon/i })).toHaveAttribute('href', '/guides/verify-a-dentist-or-surgeon')
    expect(screen.getAllByRole('link', { name: CONTACT_EMAIL })[0]).toHaveAttribute('href', `mailto:${CONTACT_EMAIL}?subject=Terms%20or%20dispute%20question`)
    expect(screen.getByText(/Last updated/)).toHaveTextContent('November 10, 2026')
  })

  it('links the privacy policy and keeps provider terms to their own services', () => {
    const { container } = render(<TermsPage />)
    expect(screen.getByRole('link', { name: 'Privacy Policy' })).toHaveAttribute('href', '/privacy')
    expect(container.textContent).toMatch(/payment, cancellation and refund terms govern the provider’s services/)
  })
})
