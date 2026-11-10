import { render } from '@testing-library/react'

import GuideRoute, { generateMetadata, generateStaticParams } from '@/app/guides/[slug]/page'
import sitemap from '@/app/sitemap'
import { GUIDES } from '@/lib/guides'

const SITE = 'https://www.myrakal.com'
const slugs = Object.keys(GUIDES)
const params = (slug: string) => ({ params: Promise.resolve({ slug }) })

describe('guides', () => {
  it('include the license verification guide and prerender every guide', async () => {
    expect(slugs).toContain('verify-a-dentist-or-surgeon')
    expect(await generateStaticParams()).toEqual(slugs.map((slug) => ({ slug })))
  })

  it('include the dental safety abroad guide', () => {
    expect(slugs).toContain('is-dental-work-abroad-safe')
  })

  it.each(slugs)('%s has its own metadata and canonical URL', async (slug) => {
    const metadata = await generateMetadata(params(slug))
    expect(String(metadata.title)).toMatch(/Myrakal/)
    expect(metadata.description?.length).toBeGreaterThan(80)
    expect(metadata.alternates?.canonical).toBe(`/guides/${slug}`)
  })

  it.each(slugs)('%s answers first, dates itself and cites its sources', async (slug) => {
    const { container } = render(await GuideRoute(params(slug)))
    const guide = GUIDES[slug as keyof typeof GUIDES]
    expect(container.querySelectorAll('main h1')).toHaveLength(1)
    expect(container.querySelector('main h1 + p')).toHaveTextContent(guide.answer)
    expect(container.querySelector('time')).toHaveAttribute('dateTime', guide.updated)
    const sources = [...container.querySelectorAll('section[aria-labelledby="sources"] a')]
    expect(sources.length).toBeGreaterThanOrEqual(3)
    for (const link of sources) expect(link.getAttribute('href')).toMatch(/^https:\/\//)
  })

  it.each(slugs)('%s describes itself as an article for answer engines', async (slug) => {
    const { container } = render(await GuideRoute(params(slug)))
    const items = [...container.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => JSON.parse(s.textContent!))
    expect(items.find((i) => i['@type'] === 'Organization')).toMatchObject({ '@id': `${SITE}/#organization` })
    expect(items.find((i) => i['@type'] === 'Article')).toMatchObject({
      url: `${SITE}/guides/${slug}`,
      dateModified: GUIDES[slug as keyof typeof GUIDES].updated,
      publisher: { '@id': `${SITE}/#organization` },
    })
  })

  it('return a 404 for an unknown guide', async () => {
    await expect(GuideRoute(params('not-a-guide'))).rejects.toThrow()
  })

  it('are listed in the sitemap and llms.txt', async () => {
    const { LLMS_TEXT } = await import('@/lib/llms')
    const urls = sitemap().map((entry) => entry.url)
    for (const slug of slugs) {
      expect(urls).toContain(`${SITE}/guides/${slug}`)
      expect(LLMS_TEXT).toContain(`${SITE}/guides/${slug}`)
    }
  })

  it('give crawlers each guide date and summary', async () => {
    const { LLMS_TEXT } = await import('@/lib/llms')
    for (const guide of Object.values(GUIDES)) {
      expect(sitemap().find((entry) => entry.url === `${SITE}/guides/${guide.slug}`)?.lastModified).toBe(guide.updated)
      expect(LLMS_TEXT).toContain(`(${SITE}/guides/${guide.slug}): ${guide.description}`)
    }
  })

  it('show the site focus ring on source links', async () => {
    const { container } = render(await GuideRoute(params(slugs[0])))
    for (const link of container.querySelectorAll('section[aria-labelledby="sources"] a')) expect(link.className).toContain('focus-visible:outline-champagne')
  })

  it('do not overstate a single plastic surgery board or promise unbuilt features', () => {
    const text = JSON.stringify(GUIDES)
    expect(text).not.toMatch(/only board the ABMS recognizes/)
    expect(text).not.toMatch(/shows you what we found/)
  })

  it('use no em dashes', () => {
    expect(JSON.stringify(GUIDES)).not.toMatch(/—/)
  })
})
