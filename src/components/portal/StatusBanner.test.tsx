import { render, screen, within } from '@testing-library/react'

import { StatusBanner } from './StatusBanner'

const steps = ['Conversation', 'Doctor review', 'Your plan', 'Payment', 'Reservations', 'Booked']

describe('StatusBanner', () => {
  it.each([
    ['intake', 'In conversation', 0],
    ['doctor_review', 'With our doctors', 1],
    ['plan_ready', 'Plan ready', 2],
    ['clarification_review', 'Plan under review', 2],
    ['awaiting_payment', 'Awaiting payment', 3],
    ['reservations', 'Booking in progress', 4],
    ['booked', 'Booked', 5],
  ])('labels %s and marks step %i as current', (status, label, index) => {
    render(<StatusBanner chatId="c1" status={status} />)
    const region = screen.getByRole('region', { name: 'Case status' })
    expect(within(region).getByText(label, { selector: 'p' })).toBeTruthy()
    const items = within(region).getAllByRole('listitem')
    expect(items.map((li) => li.textContent?.replace(/Completed|Current step|Upcoming/g, '').trim())).toEqual(steps)
    const current = items.filter((li) => li.getAttribute('aria-current') === 'step')
    expect(current).toHaveLength(1)
    expect(items.indexOf(current[0])).toBe(index)
  })

  it('summarises the current step in text for narrow screens', () => {
    render(<StatusBanner chatId="c1" status="awaiting_payment" />)
    expect(screen.getByText('Step 4 of 6: Payment')).toBeTruthy()
  })

  it('shows the status copy', () => {
    render(<StatusBanner chatId="c1" status="doctor_review" />)
    expect(screen.getByText(/A doctor will review your transcript/)).toBeTruthy()
  })

  it('links back into the conversation only during intake', () => {
    const { rerender } = render(<StatusBanner chatId="c1" status="intake" />)
    expect(screen.getByRole('link', { name: 'Continue your conversation' }).getAttribute('href')).toBe('/dashboard/c1')
    rerender(<StatusBanner chatId="c1" status="plan_ready" />)
    expect(screen.queryByRole('link', { name: 'Continue your conversation' })).toBeNull()
  })

  it('falls back without a tracker for an unknown status', () => {
    render(<StatusBanner chatId="c1" status="mystery" />)
    expect(screen.getByText('We are working on your case.')).toBeTruthy()
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
  })
})
