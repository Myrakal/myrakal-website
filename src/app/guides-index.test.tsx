import { render, screen, within } from '@testing-library/react'

import GuidesIndex, { metadata } from '@/app/guides/page'
import sitemap from '@/app/sitemap'
import { Footer } from '@/components/Footer'
import { TreatmentPage } from '@/components/TreatmentPage'
import { GUIDES } from '@/lib/guides'
import { SITE } from '@/lib/site'
import { TREATMENTS } from '@/lib/treatments'

const CALCULATOR = '/tools/dental-insurance-calculator'

describe('guides index', () => {
  it('lists every guide and the insurance calculator', () => {
    render(<GuidesIndex />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    const hrefs = screen.getAllByRole('link').map((a) => a.getAttribute('href'))
    for (const { slug } of Object.values(GUIDES)) expect(hrefs).toContain(`/guides/${slug}`)
    expect(hrefs).toContain(CALCULATOR)
  })

  it('has its own canonical URL and sitemap entry', () => {
    expect(metadata.alternates?.canonical).toBe('/guides')
    expect(sitemap().map((entry) => entry.url)).toContain(`${SITE}/guides`)
  })

  it('links treatments, guides and the calculator from the footer', () => {
    render(<Footer />)
    const nav = screen.getByRole('navigation', { name: /footer/i })
    const hrefs = within(nav).getAllByRole('link').map((a) => a.getAttribute('href'))
    expect(hrefs).toEqual(['/dental', '/cosmetic', '/guides', CALCULATOR])
  })

  it('links each treatment page to its related guides', () => {
    for (const treatment of Object.values(TREATMENTS)) {
      const { unmount } = render(<TreatmentPage treatment={treatment} />)
      const nav = screen.getByRole('navigation', { name: /before you decide/i })
      const hrefs = within(nav).getAllByRole('link').map((a) => a.getAttribute('href'))
      expect(hrefs.length).toBeGreaterThan(0)
      expect(hrefs).toContain('/guides')
      for (const href of hrefs.filter((h) => h?.startsWith('/guides/'))) expect(Object.keys(GUIDES)).toContain(href!.slice('/guides/'.length))
      unmount()
    }
  })
})
