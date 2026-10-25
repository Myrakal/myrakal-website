import { existsSync } from 'node:fs'

jest.mock('@/hooks/useSession', () => ({ useSession: () => ({ user: null, loading: false }) }))
jest.mock('@/lib/supabase', () => ({ getSupabase: () => null }))
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}))

import { metadata as layout } from './layout'
import robots from './robots'
import sitemap from './sitemap'

const SITE = 'https://www.myrakal.com'
const PUBLIC = ['', '/care', '/contact', '/privacy', '/terms', '/accessibility']
const PRIVATE = ['/chat', '/chats', '/dashboard', '/login', '/forgot-password', '/reset-password']

describe('search and sharing', () => {
  it('resolves every URL against the live site and describes Myrakal by default', () => {
    expect(String(layout.metadataBase)).toBe(`${SITE}/`)
    expect(layout.description).toMatch(/licensed doctor/i)
    expect(layout.openGraph).toMatchObject({ siteName: 'Myrakal', type: 'website', locale: 'en_US' })
    expect(layout.twitter).toMatchObject({ card: 'summary_large_image' })
  })

  it('lists every public page in the sitemap and no private ones', () => {
    const urls = sitemap().map((entry) => entry.url)
    expect(urls).toEqual(PUBLIC.map((path) => `${SITE}${path}`))
    for (const path of [...PRIVATE, '/api']) expect(urls.some((u) => u.startsWith(`${SITE}${path}`))).toBe(false)
  })

  it('points crawlers at the sitemap and keeps them out of private areas', () => {
    const rules = robots()
    expect(rules.sitemap).toBe(`${SITE}/sitemap.xml`)
    const rule = Array.isArray(rules.rules) ? rules.rules[0] : rules.rules
    expect(rule.allow).toBe('/')
    expect(rule.disallow).toEqual(['/api/'])
  })

  it.each([
    ['/chat', './chat/page'],
    ['/dashboard', './dashboard/page'],
    ['/login', './login/page'],
    ['/forgot-password', './forgot-password/page'],
    ['/reset-password', './reset-password/page'],
  ])('leaves %s crawlable so its noindex tag is seen', async (path, file) => {
    expect(robots().rules).not.toMatchObject({ disallow: expect.arrayContaining([path]) })
    const { metadata } = await import(file)
    expect(metadata.robots).toEqual({ index: false })
  })

  it('reads the site address from the environment, defaulting to the live site', async () => {
    jest.resetModules()
    process.env.NEXT_PUBLIC_SITE_URL = 'https://myrakal.com'
    const { SITE: fromEnv } = await import('@/lib/site')
    expect(fromEnv).toBe('https://myrakal.com')
    delete process.env.NEXT_PUBLIC_SITE_URL
  })

  it.each([
    ['', './page'],
    ['/care', './care/page'],
    ['/contact', './contact/page'],
    ['/privacy', './privacy/page'],
    ['/terms', './terms/page'],
    ['/accessibility', './accessibility/page'],
  ])('gives %s a canonical URL and a description', async (path, file) => {
    const { metadata } = await import(file)
    expect(metadata.alternates?.canonical).toBe(path || '/')
    expect(metadata.description?.length).toBeGreaterThan(40)
  })

  it('gives the home page its own title', async () => {
    const { metadata } = await import('./page')
    expect(metadata.title).toBe('Myrakal: Healthcare, as it should be')
  })

  it('ships a share image with alt text', () => {
    expect(existsSync(`${__dirname}/opengraph-image.jpg`)).toBe(true)
    expect(existsSync(`${__dirname}/opengraph-image.alt.txt`)).toBe(true)
  })
})
