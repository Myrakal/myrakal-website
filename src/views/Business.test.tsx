import { render, screen, within } from '@testing-library/react'

jest.mock('@/hooks/useSession', () => ({ useSession: () => ({ user: null, loading: false }) }))
jest.mock('@/lib/supabase', () => ({ getSupabase: () => null }))
jest.mock('next/navigation', () => ({ usePathname: () => '/business' }))

import Business from '@/views/Business'

describe('Business page', () => {
  it('has a single page heading with the second sentence in gold italic', () => {
    render(<Business />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    const h1 = screen.getByRole('heading', { level: 1 })
    expect(h1.textContent).toBe('Better care for your people. Less spent by your plan.')
    const em = h1.querySelector('i')
    expect(em?.textContent).toBe('Less spent by your plan.')
    expect(em?.className).toMatch(/text-champagne/)
  })

  it('shifts the closing horizon up so the lake stays in view', () => {
    render(<Business />)
    const horizon = screen.getByRole('region', { name: /book a call/i }).querySelector('img')!
    expect(horizon.getAttribute('src')).toMatch(/liquid-horizon/)
    expect(horizon.className).toMatch(/object-\[50%_70%\]/)
  })

  it('leaves no bracketed placeholders on the page', () => {
    const { container } = render(<Business />)
    expect(container.textContent).not.toMatch(/[[\]]/)
  })

  it('uses the ink ground with one velvet band and no gradients or sans fonts', () => {
    const { container } = render(<Business />)
    expect(container.querySelector('main')?.className).toMatch(/\bbg-ink\b/)
    expect(container.querySelectorAll('main .bg-velvet')).toHaveLength(1)
    expect(container.innerHTML).not.toMatch(/gradient|font-grotesk|font-sans/)
  })

  it('shows a sourced price example linked to its source', () => {
    render(<Business />)
    const problem = screen.getByRole('region', { name: /the problem/i })
    expect(within(problem).getByRole('heading', { name: 'Same care, very different prices' })).toBeTruthy()
    expect(within(problem).getByText('$965 to over $3,000').className).toMatch(/text-champagne/)
    const source = within(problem).getByRole('link', { name: /Bai, Jiang and Makary, Radiology, 2021/ })
    expect(source.getAttribute('href')).toBe('https://hub.jhu.edu/2021/12/13/radiological-services-compared-to-medicare/')
    expect(source.getAttribute('target')).toBeNull()
  })

  it('lists the five steps in order with Roman numerals', () => {
    render(<Business />)
    const how = screen.getByRole('region', { name: /how it works/i })
    expect(within(how).getByRole('heading', { level: 2 }).textContent).toBe('Alongside your plan, not instead of it.')
    const list = within(how).getByRole('list')
    expect(list.tagName).toBe('OL')
    const steps = within(list).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(steps).toEqual([
      'We set up alongside your plan.',
      'We give your people one team.',
      'We find the best-value option first.',
      'We arrange everything.',
      'We show you the savings.',
    ])
    for (const n of ['I', 'II', 'III', 'IV', 'V']) expect(within(list).getByText(n)).toBeTruthy()
    expect(within(list).getByText('No change to your carrier, network or plan design. Live in two weeks.')).toBeTruthy()
    expect(within(list).getByText(/^Reports, whenever you want them, show what was spent/)).toBeTruthy()
  })

  it('shows what employees and the company get', () => {
    render(<Business />)
    const employees = within(screen.getByRole('region', { name: /what your employees get/i })).getByRole('list')
    expect(within(employees).getAllByRole('listitem')).toHaveLength(6)
    expect(within(employees).getByText('Lower or waived out-of-pocket costs when they choose the recommended option')).toBeTruthy()
    const company = within(screen.getByRole('region', { name: /what your company gets/i })).getByRole('list')
    expect(within(company).getAllByRole('listitem')).toHaveLength(4)
    expect(within(company).getByText('Lower plan spend on everything we arrange, from prescriptions to procedures')).toBeTruthy()
    expect(within(company).getByText('No plan redesign and no new network to manage')).toBeTruthy()
  })

  it('names each benefit list once for screen readers', () => {
    const { container } = render(<Business />)
    container.querySelectorAll('ul').forEach((ul) => expect(ul.hasAttribute('aria-labelledby')).toBe(false))
  })

  it('says who it is for and how pricing works', () => {
    render(<Business />)
    expect(within(screen.getByRole('region', { name: /who it’s for/i })).getByText('Employers of any size, from small teams to large companies.')).toBeTruthy()
    expect(within(screen.getByRole('region', { name: /pricing/i })).getByText('Pricing on request. We tailor it to your team and your plan.')).toBeTruthy()
  })

  it('answers the employer questions in order', () => {
    render(<Business />)
    const faq = screen.getByRole('region', { name: /questions/i })
    const terms = faq.querySelectorAll('dt')
    expect([...terms].map((t) => t.textContent)).toEqual([
      'Do we have to change our health plan?',
      'Do employees have to travel for care?',
      'How is employee health data protected?',
      'How do you measure savings?',
      'How fast can we launch?',
    ])
    expect(within(faq).getByText(/^We handle health information in line with HIPAA\..*never an individual employee’s health details\.$/)).toBeTruthy()
    expect(within(faq).getByText(/^For every case, we compare .* Every comparison appears in your reports\.$/)).toBeTruthy()
    expect(within(faq).getByText('Two weeks from signing.')).toBeTruthy()
  })

  it('closes with the tagline over the horizon image', () => {
    const { container } = render(<Business />)
    expect(screen.getByText('Care your people will notice. Savings your plan will see.').className).toMatch(/italic/)
    expect(container.querySelector('img[src*="liquid-horizon"]')).toBeTruthy()
    expect(container.querySelector('img[src*="liquid-wave"]')).toBeTruthy()
  })

  it('points every Book a call link to contact with gold outline Caslon styling', () => {
    render(<Business />)
    const ctas = screen.getAllByRole('link', { name: /book a call/i })
    expect(ctas).toHaveLength(2)
    for (const cta of ctas) {
      expect(cta.getAttribute('href')).toBe('/contact')
      expect(cta.className).toMatch(/border-champagne/)
      expect(cta.className).toMatch(/font-caslon/)
      expect(cta.className).toMatch(/uppercase/)
      expect(cta.className).not.toMatch(/alabaster|font-display/)
    }
  })

  it('has no proof section and names no competitor', () => {
    const { container } = render(<Business />)
    expect(screen.queryByRole('heading', { name: /proof/i })).toBeNull()
    expect(container.textContent).not.toMatch(/rovi|carrum|transcarent|lantern|included health/i)
  })
})
