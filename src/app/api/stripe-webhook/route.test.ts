const updateMany = jest.fn()
const constructEvent = jest.fn()
jest.mock('@/server/db', () => ({ db: () => ({ chat: { updateMany } }) }))
jest.mock('@/server/stripe', () => ({ stripe: () => ({ webhooks: { constructEvent } }) }))

import { POST } from './route'

const ID = '3f2b8c1e-9d4a-4e6b-8a1f-2c7d5e9b0a13'
const call = (headers: Record<string, string> = { 'stripe-signature': 'sig' }) =>
  POST(new Request('https://myrakal.com/api/stripe-webhook', { method: 'POST', headers, body: '{"raw":true}' }))
const completed = (over: Record<string, unknown> = {}) => ({
  type: 'checkout.session.completed',
  data: { object: { payment_status: 'paid', metadata: { chatId: ID }, ...over } },
})

beforeEach(() => {
  jest.clearAllMocks()
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test'
  updateMany.mockResolvedValue({ count: 1 })
  constructEvent.mockReturnValue(completed())
})

describe('POST /api/stripe-webhook', () => {
  it('returns 400 without a signature header', async () => {
    expect((await call({})).status).toBe(400)
    expect(constructEvent).not.toHaveBeenCalled()
  })

  it('returns 400 when signature verification fails', async () => {
    constructEvent.mockImplementation(() => {
      throw new Error('bad signature')
    })
    expect((await call()).status).toBe(400)
    expect(updateMany).not.toHaveBeenCalled()
  })

  it('verifies the raw body with the signature and secret', async () => {
    await call()
    expect(constructEvent).toHaveBeenCalledWith('{"raw":true}', 'sig', 'whsec_test')
  })

  it('moves awaiting_payment to reservations and records paidAt', async () => {
    const res = await call()
    expect(res.status).toBe(200)
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: ID, status: 'awaiting_payment' },
      data: { status: 'reservations', paidAt: expect.any(Date) },
    })
  })

  it('returns 200 when the chat already moved so Stripe stops retrying', async () => {
    updateMany.mockResolvedValue({ count: 0 })
    expect((await call()).status).toBe(200)
  })

  it('ignores unpaid sessions, other events and missing or malformed chat ids', async () => {
    constructEvent.mockReturnValue(completed({ payment_status: 'unpaid' }))
    await call()
    constructEvent.mockReturnValue({ type: 'charge.refunded', data: { object: {} } })
    await call()
    constructEvent.mockReturnValue(completed({ metadata: {} }))
    await call()
    constructEvent.mockReturnValue(completed({ metadata: { chatId: 'nope' } }))
    const res = await call()
    expect(res.status).toBe(200)
    expect(updateMany).not.toHaveBeenCalled()
  })

  it('throws when the webhook secret is missing', async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET
    await expect(call()).rejects.toThrow(/STRIPE_WEBHOOK_SECRET/)
  })
})
