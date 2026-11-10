import { existsSync, readFileSync } from 'node:fs'

import { metadata as layout } from './layout'
import robots from './robots'
import sitemap from './sitemap'

const SITE = 'https://www.myrakal.com'

describe('search and sharing', () => {
  it('resolves every URL against the live site', () => {
    expect(String(layout.metadataBase)).toBe(`${SITE}/`)
    expect(layout.description).toMatch(/insurance won't cover/i)
    expect(layout.description).toMatch(/never take money from clinics/i)
    expect(layout.description).not.toMatch(/one all-in price/)
    expect(layout.openGraph).toMatchObject({ siteName: 'Myrakal', type: 'website', locale: 'en_US' })
  })

  it('lists the home page, treatment pages, guides and the calculator in the sitemap', () => {
    expect(sitemap().map((entry) => entry.url)).toEqual([SITE, `${SITE}/dental`, `${SITE}/cosmetic`, `${SITE}/guides/verify-a-dentist-or-surgeon`, `${SITE}/guides/is-dental-work-abroad-safe`, `${SITE}/guides/when-not-to-get-dental-work-abroad`, `${SITE}/guides/dental-tourism-facilitators-compared`, `${SITE}/tools/dental-insurance-calculator`])
  })

  it('points crawlers at the sitemap and allows everything', () => {
    const rules = robots()
    expect(rules.sitemap).toBe(`${SITE}/sitemap.xml`)
    const rule = Array.isArray(rules.rules) ? rules.rules[0] : rules.rules
    expect(rule.allow).toBe('/')
    expect(rule.disallow).toBeUndefined()
  })

  it('reads the site address from the environment, defaulting to the live site', async () => {
    jest.resetModules()
    process.env.NEXT_PUBLIC_SITE_URL = 'https://myrakal.com'
    const { SITE: fromEnv } = await import('@/lib/site')
    expect(fromEnv).toBe('https://myrakal.com')
    delete process.env.NEXT_PUBLIC_SITE_URL
  })

  it('gives the home page a canonical URL, title and description', async () => {
    const { metadata } = await import('./page')
    expect(metadata.alternates?.canonical).toBe('/')
    expect(metadata.title).toBe('Myrakal | Uncovered care, planned and booked for you')
    expect(metadata.description?.length).toBeGreaterThan(40)
  })

  it('ships a share image with alt text', () => {
    expect(existsSync(`${__dirname}/opengraph-image.jpg`)).toBe(true)
    expect(existsSync(`${__dirname}/opengraph-image.alt.txt`)).toBe(true)
  })

  it('sizes the share image at 1200 by 630', () => {
    const bytes = readFileSync(`${__dirname}/opengraph-image.jpg`)
    expect(bytes.readUInt16BE(0)).toBe(0xffd8)
    let offset = 2
    let size: { width: number; height: number } | undefined
    while (offset < bytes.length && !size) {
      const marker = bytes[offset + 1]
      if (marker === 0xc0 || marker === 0xc2) size = { height: bytes.readUInt16BE(offset + 5), width: bytes.readUInt16BE(offset + 7) }
      offset += 2 + bytes.readUInt16BE(offset + 2)
    }
    expect(size).toEqual({ width: 1200, height: 630 })
  })
})
