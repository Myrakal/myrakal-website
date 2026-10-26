import { render, screen } from '@testing-library/react'

import { CaseOverview } from './CaseOverview'

const fetchMock = jest.fn()
const realFetch = globalThis.fetch
globalThis.fetch = fetchMock
fetchMock.mockResolvedValue({ ok: true, status: 200, json: async () => [] })
afterAll(() => {
  globalThis.fetch = realFetch
})

test('composes the three cards', async () => {
  render(<CaseOverview chatId="c1" status="plan_ready" intake={{ name: 'Ada' }} priceCents={15000} paid={false} progress={{ collected: 1, total: 7 }} />)
  expect(screen.getByRole('heading', { name: 'On file' })).toBeInTheDocument()
  expect(screen.getByRole('heading', { name: 'Your price' })).toBeInTheDocument()
  expect(await screen.findByText('No documents yet')).toBeInTheDocument()
})
