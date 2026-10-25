import { render, screen, within } from '@testing-library/react'

jest.mock('@/hooks/useSession', () => ({ useSession: () => ({ user: null, loading: false }) }))
jest.mock('@/lib/supabase', () => ({ getSupabase: () => null }))
jest.mock('next/navigation', () => ({ usePathname: () => '/business' }))

import Business from '@/views/Business'

describe('Business page', () => {
  it('has a single page heading', () => {
    render(<Business />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe(
      'Better care for your people. Less spent by your plan.',
    )
  })

  it('lists the five steps in order inside an ordered list', () => {
    render(<Business />)
    const how = screen.getByRole('region', { name: /how it works/i })
    const list = within(how).getByRole('list')
    expect(list.tagName).toBe('OL')
    const steps = within(list).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(steps).toEqual([
      'We set up alongside your plan.',
      'Your people get one team.',
      'We find the best-value option before care is booked.',
      'We arrange everything.',
      'You see the savings.',
    ])
    expect(within(list).getByText('01')).toBeTruthy()
    expect(within(list).getByText('05')).toBeTruthy()
  })

  it('shows what employees and the company get', () => {
    render(<Business />)
    const employees = screen.getByRole('list', { name: /what your employees get/i })
    expect(within(employees).getAllByRole('listitem')).toHaveLength(6)
    expect(within(employees).getByText('A licensed doctor reviewing their case')).toBeTruthy()
    const company = screen.getByRole('list', { name: /what your company gets/i })
    expect(within(company).getAllByRole('listitem')).toHaveLength(4)
    expect(within(company).getByText('No plan redesign and no new network to manage')).toBeTruthy()
  })

  it('answers the employer questions', () => {
    render(<Business />)
    const faq = screen.getByRole('region', { name: /questions/i })
    for (const q of [
      'Do we have to change our health plan?',
      'Do employees have to travel for care?',
      'How is employee health data protected?',
      'How do you measure savings?',
      'How fast can we launch?',
    ]) {
      expect(within(faq).getByText(q)).toBeTruthy()
    }
  })

  it('keeps placeholders visible', () => {
    render(<Business />)
    expect(screen.getByText(/\[X to Y\]/)).toBeTruthy()
    expect(screen.getByText('[Per employee per month, a share of verified savings, or both.]')).toBeTruthy()
  })

  it('points every Book a call link to contact with alabaster styling', () => {
    render(<Business />)
    const ctas = screen.getAllByRole('link', { name: /book a call/i })
    expect(ctas).toHaveLength(2)
    for (const cta of ctas) {
      expect(cta.getAttribute('href')).toBe('/contact')
      expect(cta.className).toMatch(/alabaster/)
      expect(cta.className).not.toMatch(/champagne|gold/)
    }
  })

  it('has no proof section and names no competitor', () => {
    const { container } = render(<Business />)
    expect(screen.queryByRole('heading', { name: /proof/i })).toBeNull()
    expect(container.textContent).not.toMatch(/rovi|carrum|transcarent|lantern|included health/i)
  })
})
