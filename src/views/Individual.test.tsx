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
      'We book everything and pay your providers.',
      'We stay with you.',
    ])
  })

  it('shows the pricing table rows', () => {
    render(<Individual />)
    const table = screen.getByRole('table')
    const rows = within(table).getAllByRole('row')
    expect(within(rows[0]).getAllByRole('columnheader').map((c) => c.textContent)).toEqual(['Item', 'Price', 'Notes'])
    expect(rows.slice(1).map((r) => within(r).getByRole('rowheader').textContent)).toEqual([
      'Doctor review',
      'Your plan',
      'Financing',
      'Insurance',
    ])
    expect(within(table).getByText('$150')).toBeTruthy()
    expect(within(table).getByText('On request')).toBeTruthy()
    expect(screen.queryByText(/prices shown/i)).toBeNull()
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
      expect(cta.getAttribute('href')).toBe('/dashboard')
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

  it('names the pricing table and heads each row for screen readers', () => {
    render(<Individual />)
    const table = screen.getByRole('table', { name: /what you pay/i })
    for (const item of ['Doctor review', 'Your plan', 'Financing', 'Insurance'])
      expect(within(table).getByRole('rowheader', { name: item })).toBeTruthy()
  })

  it('lets the pricing table scroll on its own at narrow widths', () => {
    render(<Individual />)
    expect(screen.getByRole('table', { name: /what you pay/i }).parentElement!.className).toMatch(/overflow-x-auto/)
  })

  it('has no placeholders left', () => {
    const { container } = render(<Individual />)
    expect(container.textContent).not.toMatch(/\[[^\]]*\]/)
  })

  it('says patients pay Myrakal after approving their plan and Myrakal pays each provider', () => {
    const { container } = render(<Individual />)
    expect(screen.getByText('Appointments, paperwork, and travel and stays when needed. Once you approve your plan, you pay us, and we pay each provider.')).toBeTruthy()
    expect(container.textContent).not.toMatch(/pay us once|pay for everything|pay providers directly|through your provider|complication coverage/i)
    expect(screen.getByText('Ask your coordinator about paying over time')).toBeTruthy()
  })

  it('commits to a review turnaround and explains what happens if something goes wrong', () => {
    render(<Individual />)
    expect(screen.getByText('Within 2 business days of completing intake.')).toBeTruthy()
    expect(screen.getByText(/Your coordinator stays with you and works directly with your providers to resolve it\./)).toBeTruthy()
  })
})
