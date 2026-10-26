import { render, screen, within } from '@testing-library/react'

import { CaseJourney } from './CaseJourney'

const steps = ['Conversation', 'Doctor review', 'Your plan', 'Payment', 'Reservations', 'Booked']

describe('CaseJourney', () => {
  it.each([
    ['intake', 0],
    ['doctor_review', 1],
    ['plan_ready', 2],
    ['clarification_review', 2],
    ['awaiting_payment', 3],
    ['reservations', 4],
    ['booked', 5],
  ])('%s marks step %i as current', (status, index) => {
    render(<CaseJourney status={status} />)
    const items = within(screen.getByRole('region', { name: 'Your journey' })).getAllByRole('listitem')
    expect(items.map((li) => li.textContent?.replace(/Completed|Upcoming/g, '').trim())).toEqual(steps)
    const current = items.filter((li) => li.getAttribute('aria-current') === 'step')
    expect(current).toHaveLength(1)
    expect(items.indexOf(current[0])).toBe(index)
    expect(screen.getByText(`Step ${index + 1} of 6`)).toBeTruthy()
  })

  it('renders nothing for an unknown status', () => {
    const { container } = render(<CaseJourney status="mystery" />)
    expect(container.firstChild).toBeNull()
  })
})
