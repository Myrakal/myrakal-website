import { render, screen, within } from '@testing-library/react'

jest.mock('@/hooks/useSession', () => ({ useSession: () => ({ user: null, loading: false }) }))
jest.mock('@/lib/supabase', () => ({ getSupabase: () => null }))
jest.mock('next/navigation', () => ({ usePathname: () => '/care' }))

import Care from '@/views/Care'

describe('Care page', () => {
  it('has a single page heading', () => {
    render(<Care />)
    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1)
    expect(screen.getByRole('heading', { level: 1 }).textContent).toMatch(/every kind of care, arranged/i)
  })

  it('explains everything Myrakal does for a patient', () => {
    render(<Care />)
    const services = screen.getByRole('region', { name: /what we do/i })
    for (const name of [
      /find your doctor/i,
      /insurance and financing/i,
      /everything arranged/i,
      /aftercare/i,
      /prescriptions/i,
      /every step/i,
    ]) {
      expect(within(services).getByRole('heading', { level: 3, name })).toBeTruthy()
    }
    expect(within(services).getByText(/paperwork/i)).toBeTruthy()
    expect(within(services).getByText(/hotel/i)).toBeTruthy()
  })

  it('walks through the workflow in order, each step marked on the gold thread', () => {
    const { container } = render(<Care />)
    const services = screen.getByRole('region', { name: /what we do/i })
    const steps = within(services).getAllByRole('listitem')
    expect(steps.map((li) => within(li).getByRole('heading', { level: 3 }).textContent)).toEqual([
      'Find your doctor',
      'Insurance and financing',
      'Everything arranged',
      'Aftercare',
    ])
    steps.forEach((li) => expect(li.querySelector('[data-thread-stop].bg-champagne')).toBeTruthy())
    expect(container.querySelector('main svg path')).toBeTruthy()
  })

  it('shows what we cover in everyday, ongoing and major tiers', () => {
    render(<Care />)
    const cover = screen.getByRole('region', { name: /what we cover/i })
    const tiers = within(cover).getAllByRole('heading', { level: 3 }).map((h) => h.textContent)
    expect(tiers).toEqual(['Everyday', 'Ongoing', 'Major'])
  })

  it('shows clinical detail without hiding it behind a click', () => {
    render(<Care />)
    expect(screen.getByText('Know your numbers')).toBeTruthy()
    expect(screen.getByText(/lab tests and bloodwork/i)).toBeTruthy()
    expect(screen.getByText('Back on your feet')).toBeTruthy()
    expect(screen.queryAllByRole('button', { expanded: false })).toHaveLength(0)
  })

  it('never tags care with a location', () => {
    render(<Care />)
    expect(screen.queryByText(/abroad/i)).toBeNull()
  })

  it('invites requests that are not listed', () => {
    render(<Care />)
    expect(screen.getByText(/if it can be planned, we can arrange it/i)).toBeTruthy()
  })

  it('covers standards for clinics, doctors and protection', () => {
    render(<Care />)
    const standards = screen.getByRole('region', { name: /our standards/i })
    for (const title of ['Clinics', 'Doctors', 'Protection']) {
      expect(within(standards).getByRole('heading', { name: title })).toBeTruthy()
    }
  })

  it('splits visitors toward individual and business paths with visible focus', () => {
    render(<Care />)
    const self = screen.getByRole('link', { name: /for yourself/i })
    expect(self.getAttribute('href')).toBe('/chat/')
    expect(self.className).toMatch(/focus-visible:outline-alabaster/)
    expect(screen.getByRole('link', { name: /for your team/i }).getAttribute('href')).toBe('/contact')
  })
})
