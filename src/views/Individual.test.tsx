import { render, screen, within } from '@testing-library/react'

jest.mock('@/hooks/useSession', () => ({ useSession: () => ({ user: null, loading: false }) }))
jest.mock('@/lib/supabase', () => ({ getSupabase: () => null }))
jest.mock('next/navigation', () => ({ usePathname: () => '/individual' }))

import Individual from '@/views/Individual'

describe('Individual page', () => {
  it('has a single page heading', () => {
    render(<Individual />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/one team for all of your care/i)
  })

  it('lists the five steps in order inside an ordered list', () => {
    render(<Individual />)
    const region = screen.getByRole('region', { name: /how it works for you/i })
    const list = within(region).getByRole('list')
    expect(list.tagName).toBe('OL')
    const steps = within(list).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(steps).toEqual([
      'Tell us what you need.',
      'A licensed doctor reviews your case.',
      'You get one plan and one price.',
      'We arrange and pay for everything.',
      'We stay with you.',
    ])
  })

  it('shows the pricing table rows', () => {
    render(<Individual />)
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    expect(within(rows[0]).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Item', 'Price', 'Notes'])
    expect(rows.slice(1).map((r) => within(r).getAllByRole('cell')[0].textContent)).toEqual([
      'Doctor review',
      'Your plan',
      'Financing',
      'Insurance',
    ])
    expect(within(table).getByText('[$150]')).toBeTruthy()
    expect(screen.getByText('Prices shown are a template and will change.')).toBeTruthy()
  })

  it('answers the common questions', () => {
    render(<Individual />)
    for (const q of [
      'Do I need insurance?',
      'Will I have to travel?',
      'Does AI make medical decisions?',
      'How quickly will I hear back?',
      'What if something goes wrong?',
      'Is my information private?',
    ]) {
      expect(screen.getByText(q)).toBeTruthy()
    }
  })

  it('points every Talk with us link to chat in alabaster', () => {
    render(<Individual />)
    const ctas = screen.getAllByRole('link', { name: /talk with us/i })
    expect(ctas.length).toBeGreaterThanOrEqual(2)
    for (const cta of ctas) {
      expect(cta.getAttribute('href')).toBe('/chat/')
      expect(cta.className).toMatch(/alabaster/)
      expect(cta.className).not.toMatch(/champagne/)
    }
  })

  it('links to the privacy policy', () => {
    render(<Individual />)
    const faq = screen.getByRole('region', { name: 'Questions' })
    expect(within(faq).getByRole('link', { name: 'Privacy Policy' }).getAttribute('href')).toBe('/privacy/')
  })

  it('never calls care cheap', () => {
    const { container } = render(<Individual />)
    expect(container.textContent).not.toMatch(/cheap/i)
  })
})
