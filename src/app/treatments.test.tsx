import { render, screen, within } from '@testing-library/react'

import Dental, { metadata as dentalMetadata } from '@/app/dental/page'
import Home from '@/app/page'
import sitemap from '@/app/sitemap'
import { TREATMENTS } from '@/lib/treatments'

beforeEach(() => {
  window.matchMedia = ((query: string) => ({
    matches: true,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia
})

const pages = [
  ['dental', Dental, dentalMetadata, /dental/i],
] as const

describe.each(pages)('/%s', (slug, Page, metadata, topic) => {
  it('has its own title, description and canonical URL', () => {
    expect(String(metadata.title)).toMatch(topic)
    expect(String(metadata.title)).toMatch(/Myrakal/)
    expect(metadata.description?.length).toBeGreaterThan(80)
    expect(metadata.alternates?.canonical).toBe(`/${slug}`)
  })

  it('leads with the best option anywhere, not only abroad', () => {
    const { container } = render(<Page />)
    expect(container.querySelectorAll('main h1')).toHaveLength(1)
    const places = container.querySelector('section[aria-labelledby="where-we-look"]') as HTMLElement
    expect(within(places).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)).toEqual([
      'Near you',
      'Elsewhere in the U.S.',
      'Abroad',
    ])
    expect(screen.getByText('Do I have to go abroad?')).toBeInTheDocument()
  })

  it('answers what it costs and sends a quote by email', () => {
    const { container } = render(<Page />)
    expect(container.textContent).toMatch(/We never take money from clinics\./)
    expect(screen.getAllByRole('link').some((link) => link.getAttribute('href')?.startsWith('mailto:'))).toBe(true)
  })

  it('describes the service for answer engines', () => {
    const { container } = render(<Page />)
    const items = [...container.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => JSON.parse(s.textContent!))
    expect(items.find((i) => i['@type'] === 'Organization')).toMatchObject({ '@id': 'https://www.myrakal.com/#organization', name: 'Myrakal' })
    expect(items.find((i) => i['@type'] === 'Service')).toMatchObject({
      url: `https://www.myrakal.com/${slug}`,
      provider: { '@id': 'https://www.myrakal.com/#organization' },
    })
  })
})

describe('treatment pages', () => {
  it('are listed in the sitemap', () => {
    const urls = sitemap().map((entry) => entry.url)
    expect(urls).toContain('https://www.myrakal.com/dental')
  })

  it('are linked from the home page service cards', () => {
    const { container } = render(<Home />)
    const services = container.querySelector('section[aria-labelledby="services"]') as HTMLElement
    expect(within(services).getAllByRole('link').map((a) => a.getAttribute('href'))).toEqual(['/dental'])
  })

  it('are listed in llms.txt', async () => {
    const { LLMS_TEXT } = await import('@/lib/llms')
    for (const { name, slug } of Object.values(TREATMENTS)) expect(LLMS_TEXT).toContain(`- [${name}](https://www.myrakal.com/${slug})`)
  })

  it('hide the default disclosure marker on FAQ toggles', () => {
    const { container } = render(<Dental />)
    for (const summary of container.querySelectorAll('summary')) expect(summary.className).toContain('list-none')
  })

  it('use no em dashes in their copy', () => {
    expect(JSON.stringify(TREATMENTS)).not.toMatch(/—/)
  })
})
