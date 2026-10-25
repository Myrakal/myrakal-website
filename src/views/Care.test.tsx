import { fireEvent, render, screen, within } from '@testing-library/react'

jest.mock('@/hooks/useSession', () => ({ useSession: () => ({ user: null, loading: false }) }))
jest.mock('@/lib/supabase', () => ({ getSupabase: () => null }))

import Care from '@/views/Care'

describe('Care page', () => {
  it('has a single page heading', () => {
    render(<Care />)
    expect(screen.getByRole('heading', { level: 1, name: /every kind of care, arranged/i })).toBeTruthy()
  })

  it('groups care into everyday, ongoing and major tiers in that order', () => {
    render(<Care />)
    const tiers = screen.getAllByRole('heading', { level: 2 }).map((h) => h.textContent)
    expect(tiers.slice(0, 3)).toEqual(['Everyday', 'Ongoing', 'Major'])
  })

  it('lists outcomes from lab tests through surgery', () => {
    render(<Care />)
    for (const name of ['Know your numbers', 'Your everyday medicine', 'Starting a family', 'Back on your feet']) {
      expect(screen.getByRole('button', { name: new RegExp(name, 'i') })).toBeTruthy()
    }
  })

  it('reveals the clinical detail when an outcome is opened', () => {
    render(<Care />)
    const trigger = screen.getByRole('button', { name: /know your numbers/i })
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText(/lab tests and bloodwork/i)).toBeTruthy()
  })

  it('never tags care with a location', () => {
    render(<Care />)
    expect(screen.queryByText(/abroad/i)).toBeNull()
  })

  it('gives every control on cream a visible velvet focus ring', () => {
    render(<Care />)
    expect(screen.getByRole('button', { name: /your smile/i }).className).toMatch(/focus-visible:ring-velvet/)
    expect(screen.getByRole('link', { name: /for yourself/i }).className).toMatch(/focus-visible:outline-velvet/)
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

  it('splits visitors toward individual and business paths', () => {
    render(<Care />)
    expect(screen.getByRole('link', { name: /for yourself/i }).getAttribute('href')).toBe('/chat/')
    expect(screen.getByRole('link', { name: /for your team/i }).getAttribute('href')).toBe('/contact')
  })
})
