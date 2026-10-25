import { render } from '@testing-library/react'

jest.mock('@/hooks/useSession', () => ({ useSession: () => ({ user: null, loading: false }) }))
jest.mock('@/lib/supabase', () => ({ getSupabase: () => null }))

import Home from '@/app/page'
import { JsonLd } from '@/components/JsonLd'
import Care from '@/views/Care'

const graph = (container: HTMLElement) =>
  [...container.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => {
    const data = JSON.parse(s.textContent!)
    return Array.isArray(data) ? data : [data]
  })

describe('answer engine markup', () => {
  it('describes Myrakal as an organization and a website on the home page', () => {
    const items = graph(render(<Home />).container)
    const org = items.find((i) => i['@type'] === 'Organization')
    expect(org).toMatchObject({
      '@context': 'https://schema.org',
      name: 'Myrakal',
      url: 'https://www.myrakal.com',
      slogan: 'Healthcare, as it should be',
      address: { '@type': 'PostalAddress', addressLocality: 'Chicago', addressRegion: 'IL', addressCountry: 'US' },
    })
    expect(org.logo).toMatch(/^https:\/\/www\.myrakal\.com\//)
    expect(items.find((i) => i['@type'] === 'WebSite')).toMatchObject({ name: 'Myrakal', url: 'https://www.myrakal.com' })
  })

  it('marks up every home FAQ as question and answer, matching the visible text', () => {
    const { container } = render(<Home />)
    const faq = graph(container).find((i) => i['@type'] === 'FAQPage')
    const shown = [...container.querySelectorAll('[data-slot="accordion-trigger"]')].map((t) => t.textContent)
    expect(faq.mainEntity.length).toBeGreaterThan(5)
    expect(faq.mainEntity.map((q: { name: string }) => q.name)).toEqual(shown)
    const page = container.cloneNode(true) as HTMLElement
    page.querySelectorAll('script').forEach((s) => s.remove())
    faq.mainEntity.forEach((q: { acceptedAnswer: { text: string } }) => expect(page.textContent).toContain(q.acceptedAnswer.text))
  })

  it('says Myrakal handles insurance, travel and documents today, never as future plans', () => {
    const faq = graph(render(<Home />).container).find((i) => i['@type'] === 'FAQPage')
    const all = JSON.stringify(faq)
    expect(all).not.toMatch(/building out|what’s next|what's next/i)
    const handles = faq.mainEntity.find((q: { name: string }) => q.name === 'What does Myrakal handle?')
    for (const word of [/insurance/i, /flights/i, /hotels/i, /documents/i, /aftercare/i]) expect(handles.acceptedAnswer.text).toMatch(word)
  })

  it('describes care as a coordination service, never a medical provider', () => {
    const items = graph(render(<Care />).container)
    const service = items.find((i) => i['@type'] === 'Service')
    expect(items.find((i) => i['@type'] === 'Organization')?.['@id']).toBe(service.provider['@id'])
    expect(service).toMatchObject({ serviceType: 'Healthcare coordination', areaServed: 'US', provider: { name: 'Myrakal' } })
    expect(JSON.stringify(items)).not.toMatch(/Medical(Organization|Clinic|Business)|Physician|Hospital/)
  })

  it('escapes markup inside structured data', () => {
    const { container } = render(<JsonLd data={{ name: '</script><b>x</b>' }} />)
    expect(container.querySelector('script')!.innerHTML).not.toContain('</script>')
    expect(JSON.parse(container.querySelector('script')!.textContent!).name).toBe('</script><b>x</b>')
  })

  it('publishes a plain-language summary for AI crawlers on the configured address', async () => {
    const { LLMS_TEXT: text } = await import('@/lib/llms')
    expect(text.startsWith('# Myrakal')).toBe(true)
    for (const phrase of [/licensed doctor/i, /https:\/\/www\.myrakal\.com\/care/, /not medical advice/i]) expect(text).toMatch(phrase)
  })
})
