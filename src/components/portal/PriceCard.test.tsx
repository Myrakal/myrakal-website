import { render, screen } from '@testing-library/react'

import { PriceCard } from './PriceCard'

test('shows the price and due message before payment', () => {
  render(<PriceCard status="plan_ready" priceCents={15000} paid={false} />)
  expect(screen.getByText('$150.00')).toBeInTheDocument()
  expect(screen.getByText('Due after you approve your plan')).toBeInTheDocument()
})

test('shows paid', () => {
  render(<PriceCard status="booked" priceCents={15000} paid />)
  expect(screen.getByText('Paid')).toBeInTheDocument()
})

test('renders nothing outside plan statuses or without a price', () => {
  const { container, rerender } = render(<PriceCard status="intake" priceCents={15000} paid={false} />)
  expect(container).toBeEmptyDOMElement()
  rerender(<PriceCard status="plan_ready" priceCents={null} paid={false} />)
  expect(container).toBeEmptyDOMElement()
})

test('says payment is due once the plan is approved', () => {
  render(<PriceCard status="awaiting_payment" priceCents={15000} paid={false} />)
  expect(screen.getByText('Payment is due')).toBeInTheDocument()
})
