import { render, screen, within } from '@testing-library/react'

import HowWeVerify, { metadata } from './page'
import sitemap from '../sitemap'
import { SITE } from '@/lib/site'

describe('provider verification methodology', () => {
  it('defines verified and its limits in patient-facing language', () => {
    render(<HowWeVerify />)
    expect(screen.getByRole('heading', { level: 1, name: /what “verified” means/i })).toBeInTheDocument()
    expect(screen.getByText(/screening standard, not an endorsement, a guarantee, or medical advice/i)).toBeInTheDocument()
    const limits = screen.getByRole('heading', { name: /what verification cannot tell you/i }).closest('section')
    expect(limits).not.toBeNull()
    expect(within(limits!).getByText(/does not guarantee safety, quality, availability/i)).toBeInTheDocument()
    expect(screen.getByText(/never takes money from clinics/i)).toBeInTheDocument()
  })

  it('has bounded metadata, canonical data and a sitemap entry', () => {
    expect(metadata.alternates?.canonical).toBe('/how-we-verify')
    expect(metadata.description?.length).toBeGreaterThan(80)
    expect(metadata.description?.length).toBeLessThanOrEqual(160)
    expect(sitemap().map((entry) => entry.url)).toContain(`${SITE}/how-we-verify`)
  })

  it('publishes WebPage structured data tied to the organization', () => {
    const { container } = render(<HowWeVerify />)
    const data = JSON.parse(container.querySelector('script[type="application/ld+json"]')!.textContent!)
    expect(data[1]).toMatchObject({
      '@type': 'WebPage',
      url: `${SITE}/how-we-verify`,
      publisher: { '@id': `${SITE}/#organization` },
    })
  })
})
