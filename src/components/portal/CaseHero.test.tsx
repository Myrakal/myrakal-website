import { render, screen } from '@testing-library/react'

import { CaseHero } from './CaseHero'

describe('CaseHero', () => {
  it.each([
    ['intake', 'Action needed', 'With our doctors'],
    ['plan_ready', 'Action needed', 'Plan ready'],
    ['awaiting_payment', 'Action needed', 'Awaiting payment'],
    ['doctor_review', 'Nothing needed from you', 'With our doctors'],
    ['clarification_review', 'Nothing needed from you', 'Plan under review'],
    ['reservations', 'Nothing needed from you', 'Booking in progress'],
    ['booked', 'Nothing needed from you', 'Booked'],
  ])('%s shows the right eyebrow', (status, eyebrow) => {
    render(<CaseHero chatId="c1" status={status} />)
    const region = screen.getByRole('region', { name: 'Case status' })
    expect(region.textContent).toContain(eyebrow)
  })

  it('shows the stage label and copy', () => {
    render(<CaseHero chatId="c1" status="doctor_review" />)
    expect(screen.getByRole('heading', { name: 'With our doctors' })).toBeTruthy()
    expect(screen.getByText(/A doctor will review your transcript/)).toBeTruthy()
  })

  it('links to the conversation during intake', () => {
    render(<CaseHero chatId="c1" status="intake" />)
    expect(screen.getByRole('link', { name: 'Continue conversation' }).getAttribute('href')).toBe('/dashboard/c1')
  })

  it('links to the plan and approval when the plan is ready', () => {
    render(<CaseHero chatId="c1" status="plan_ready" />)
    expect(screen.getByRole('link', { name: 'Review your plan' }).getAttribute('href')).toBe('#plan')
    expect(screen.getByRole('link', { name: 'Approve' }).getAttribute('href')).toBe('#approve')
  })

  it('links to payment when awaiting payment', () => {
    render(<CaseHero chatId="c1" status="awaiting_payment" />)
    expect(screen.getByRole('link', { name: 'Go to payment' }).getAttribute('href')).toBe('#payment')
  })

  it.each(['doctor_review', 'clarification_review', 'reservations', 'booked'])('has no actions in %s', (status) => {
    render(<CaseHero chatId="c1" status={status} />)
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })

  it('falls back for an unknown status', () => {
    render(<CaseHero chatId="c1" status="mystery" />)
    expect(screen.getByText('We are working on your case.')).toBeTruthy()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })
})
