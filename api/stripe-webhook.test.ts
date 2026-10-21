import { vi } from 'vitest'

const ID = '11111111-1111-4111-8111-111111111111'
const constructEventAsync = vi.fn()
const updateMany = vi.fn()
vi.mock('../server/db.ts', () => ({ db: () => ({ intake: { updateMany } }) }))
vi.mock('../server/stripe.ts', () => ({ stripe: () => ({ webhooks: { constructEventAsync } }) }))

import { POST } from './stripe-webhook'

const post = (body = '{"raw":1}', headers: Record<string, string> = { 'stripe-signature': 'sig' }) =>
  POST(new Request('http://localhost/api/stripe-webhook', { method: 'POST', headers, body }))

describe('POST /api/stripe-webhook', () => {
  beforeEach(() => {
    constructEventAsync.mockReset()
    updateMany.mockReset()
    updateMany.mockResolvedValue({ count: 1 })
    process.env.STRIPE_WEBHOOK_SECRET = 'whsec_1'
  })

  it('returns 400 without a signature header', async () => {
    expect((await post('{}', {})).status).toBe(400)
    expect(constructEventAsync).not.toHaveBeenCalled()
  })

  it('returns 400 on a bad signature', async () => {
    constructEventAsync.mockRejectedValue(new Error('bad sig'))
    expect((await post()).status).toBe(400)
    expect(updateMany).not.toHaveBeenCalled()
  })

  it('verifies the raw body with the webhook secret', async () => {
    constructEventAsync.mockResolvedValue({ type: 'ping', data: { object: {} } })
    await post('{"raw":1}')
    expect(constructEventAsync).toHaveBeenCalledWith('{"raw":1}', 'sig', 'whsec_1')
  })

  it('marks the intake paid on a paid completed session', async () => {
    constructEventAsync.mockResolvedValue({
      type: 'checkout.session.completed',
      data: { object: { payment_status: 'paid', metadata: { intakeId: ID } } },
    })
    expect((await post()).status).toBe(200)
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: ID, consultStatus: 'awaiting_payment' },
      data: { paidAt: expect.any(Date), consultStatus: 'in_review' },
    })
  })

  it('ignores unpaid sessions and other events', async () => {
    constructEventAsync.mockResolvedValue({
      type: 'checkout.session.completed',
      data: { object: { payment_status: 'unpaid', metadata: { intakeId: ID } } },
    })
    expect((await post()).status).toBe(200)
    constructEventAsync.mockResolvedValue({ type: 'other', data: { object: {} } })
    expect((await post()).status).toBe(200)
    expect(updateMany).not.toHaveBeenCalled()
  })

  it('returns 500 when the database fails so Stripe retries', async () => {
    constructEventAsync.mockResolvedValue({
      type: 'checkout.session.completed',
      data: { object: { payment_status: 'paid', metadata: { intakeId: ID } } },
    })
    updateMany.mockRejectedValue(new Error('db down'))
    expect((await post()).status).toBe(500)
  })

  it('logs the intake id when no awaiting intake matched', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    constructEventAsync.mockResolvedValue({
      type: 'checkout.session.completed',
      data: { object: { payment_status: 'paid', metadata: { intakeId: ID } } },
    })
    updateMany.mockResolvedValue({ count: 0 })
    expect((await post()).status).toBe(200)
    expect(error).toHaveBeenCalledWith(expect.stringContaining(ID))
    error.mockRestore()
  })

  it('returns 200 without touching the database for a malformed intake id', async () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => {})
    constructEventAsync.mockResolvedValue({
      type: 'checkout.session.completed',
      data: { object: { payment_status: 'paid', metadata: { intakeId: 'not-a-uuid' } } },
    })
    expect((await post()).status).toBe(200)
    expect(updateMany).not.toHaveBeenCalled()
    expect(error).toHaveBeenCalled()
    error.mockRestore()
  })
})
