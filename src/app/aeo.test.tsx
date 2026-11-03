import { render } from '@testing-library/react'

import Home from '@/app/page'
import { JsonLd } from '@/components/JsonLd'

describe('answer engine markup', () => {
  it('describes Myrakal as an organization and a website on the home page', () => {
    const { container } = render(<Home />)
    const items = [...container.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => JSON.parse(s.textContent!))
    expect(items.find((i) => i['@type'] === 'Organization')).toMatchObject({ name: 'Myrakal', url: 'https://www.myrakal.com' })
    expect(items.find((i) => i['@type'] === 'WebSite')).toMatchObject({ name: 'Myrakal' })
  })

  it('escapes markup inside structured data', () => {
    const { container } = render(<JsonLd data={{ name: '</script><b>x</b>' }} />)
    expect(container.querySelector('script')!.innerHTML).not.toContain('</script>')
  })

  it('publishes a plain-language summary for AI crawlers', async () => {
    const { LLMS_TEXT: text } = await import('@/lib/llms')
    expect(text.startsWith('# Myrakal')).toBe(true)
    expect(text).toMatch(/free/i)
    expect(text).toMatch(/not medical advice/i)
  })
})
