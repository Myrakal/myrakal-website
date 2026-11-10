import { fireEvent, render, screen } from '@testing-library/react'

import Calculator, { metadata } from '@/app/tools/dental-insurance-calculator/page'
import sitemap from '@/app/sitemap'

const URL = 'https://www.myrakal.com/tools/dental-insurance-calculator'

beforeEach(() => {
  window.matchMedia = ((query: string) => ({
    matches: true,
    media: query,
    addEventListener() {},
    removeEventListener() {},
  })) as unknown as typeof window.matchMedia
})

function set(label: RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

function results() {
  return {
    pays: screen.getByLabelText('Insurance pays').textContent,
    you: screen.getByLabelText('You pay').textContent,
    share: screen.getByText(/^Insurance covers/).textContent,
  }
}

describe('/tools/dental-insurance-calculator', () => {
  it('labels four numeric inputs with sensible defaults', () => {
    render(<Calculator />)
    const fields = [
      [/quote total/i, '30000'],
      [/annual maximum left/i, '1500'],
      [/coverage for major work/i, '50'],
      [/deductible left/i, '50'],
    ] as const
    for (const [label, value] of fields) {
      const input = screen.getByLabelText(label) as HTMLInputElement
      expect(input.value).toBe(value)
      expect(input.getAttribute('inputmode')).toBe('numeric')
    }
  })

  it('caps the payout at the annual maximum for the defaults', () => {
    render(<Calculator />)
    expect(results()).toEqual({ pays: '$1,500', you: '$28,500', share: 'Insurance covers 5% of this quote.' })
  })

  it('pays the coverage share after the deductible when under the cap', () => {
    render(<Calculator />)
    set(/quote total/i, '1000')
    expect(results()).toEqual({ pays: '$475', you: '$525', share: 'Insurance covers 48% of this quote.' })
  })

  it('never shows two results that add up to more than the quote', () => {
    render(<Calculator />)
    set(/quote total/i, '1001')
    expect(results()).toEqual({ pays: '$476', you: '$525', share: 'Insurance covers 48% of this quote.' })
  })

  it('keeps inputs visible and results readable on small screens', () => {
    const { container } = render(<Calculator />)
    for (const input of container.querySelectorAll('input')) expect(input.className).toContain('border-mist/60')
    for (const output of container.querySelectorAll('output')) expect(output.className).toMatch(/text-4xl.*break-words/)
    expect(container.querySelector('[aria-live]')).toBeNull()
  })

  it('updates live when the cap changes', () => {
    render(<Calculator />)
    set(/annual maximum left/i, '3000')
    expect(results().pays).toBe('$3,000')
    expect(results().you).toBe('$27,000')
  })

  it('treats empty, zero and negative input as zero', () => {
    render(<Calculator />)
    set(/quote total/i, '')
    expect(results()).toEqual({ pays: '$0', you: '$0', share: 'Insurance covers 0% of this quote.' })
    set(/quote total/i, '-500')
    set(/coverage for major work/i, 'abc')
    expect(document.body.textContent).not.toMatch(/NaN/)
    expect(results().pays).toBe('$0')
    set(/quote total/i, '2000')
    set(/coverage for major work/i, '0')
    expect(results()).toEqual({ pays: '$0', you: '$2,000', share: 'Insurance covers 0% of this quote.' })
  })

  it('explains the cap with dated, linked sources and asks for the quote', () => {
    const { container } = render(<Calculator />)
    expect(container.querySelectorAll('main h1')).toHaveLength(1)
    const sources = screen.getByRole('list', { name: /sources/i })
    expect(sources.querySelectorAll('a[href^="https://"]').length).toBeGreaterThanOrEqual(2)
    expect(container.textContent).toMatch(/send us your quote/i)
    expect(screen.getAllByRole('button', { name: 'Send your quote' }).length).toBeGreaterThan(0)
  })

  it('uses no em dashes or cheap language', () => {
    const { container } = render(<Calculator />)
    expect(container.textContent).not.toMatch(/—/)
    expect(container.querySelector('main')!.textContent).not.toMatch(/cheap/i)
  })

  it('has its own title, description and canonical URL', () => {
    expect(metadata.title).toBe('Dental insurance calculator: what your plan will really pay | Myrakal')
    expect(metadata.description?.length).toBeGreaterThan(80)
    expect(metadata.alternates?.canonical).toBe('/tools/dental-insurance-calculator')
  })

  it('describes itself as a free web application', () => {
    const { container } = render(<Calculator />)
    const items = [...container.querySelectorAll('script[type="application/ld+json"]')].flatMap((s) => JSON.parse(s.textContent!))
    expect(items.find((i) => i['@type'] === 'Organization')).toMatchObject({ '@id': 'https://www.myrakal.com/#organization' })
    expect(items.find((i) => i['@type'] === 'WebApplication')).toMatchObject({
      url: URL,
      applicationCategory: 'FinanceApplication',
      offers: { price: 0 },
      provider: { '@id': 'https://www.myrakal.com/#organization' },
    })
  })

  it('is listed in the sitemap and llms.txt', async () => {
    expect(sitemap().map((entry) => entry.url)).toContain(URL)
    const { LLMS_TEXT } = await import('@/lib/llms')
    expect(LLMS_TEXT).toContain(`](${URL})`)
  })
})
