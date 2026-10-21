import { vi } from 'vitest'

const findUnique = vi.fn()
const update = vi.fn()
const create = vi.fn()
vi.mock('../server/db.ts', () => ({ db: () => ({ intake: { findUnique, update } }) }))
vi.mock('../server/stripe.ts', async () => {
  class StripeNotConfigured extends Error {}
  return {
    StripeNotConfigured,
    stripe: () => {
      if (!process.env.STRIPE_SECRET_KEY) throw new StripeNotConfigured()
      return { checkout: { sessions: { create } } }
    },
  }
})

import { POST } from './checkout'

const id = '11111111-1111-4111-8111-111111111111'
const post = (body: unknown, headers: Record<string, string> = {}) =>
  POST(
    new Request('http://localhost/api/checkout', {
      method: 'POST',
      headers: { 'content-type': 'application/json', origin: 'http://localhost', ...headers },
      body: JSON.stringify(body),
    }),
  )

describe('POST /api/checkout', () => {
  beforeEach(() => {
    findUnique.mockReset()
    update.mockReset()
    create.mockReset()
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    delete process.env.CONSULT_PRICE_CENTS
  })

  it('rejects cross-origin requests', async () => {
    expect((await post({ intakeId: id }, { origin: 'https://evil.com' })).status).toBe(403)
    expect(findUnique).not.toHaveBeenCalled()
  })

  it('returns 404 for a malformed id without touching the database', async () => {
    expect((await post({ intakeId: 'nope' })).status).toBe(404)
    expect(findUnique).not.toHaveBeenCalled()
  })

  it('returns 404 for an unknown intake', async () => {
    findUnique.mockResolvedValue(null)
    expect((await post({ intakeId: id })).status).toBe(404)
  })

  it('returns 409 when already paid', async () => {
    findUnique.mockResolvedValue({ id, email: 'a@b.co', paidAt: new Date() })
    expect((await post({ intakeId: id })).status).toBe(409)
    expect(create).not.toHaveBeenCalled()
  })

  it('returns 503 when Stripe is not configured', async () => {
    delete process.env.STRIPE_SECRET_KEY
    findUnique.mockResolvedValue({ id, email: 'a@b.co', paidAt: null })
    const res = await post({ intakeId: id })
    expect(res.status).toBe(503)
    expect(await res.json()).toEqual({ error: 'Payments are not configured' })
  })

  it('creates a session, stores its id and returns the url', async () => {
    findUnique.mockResolvedValue({ id, email: 'a@b.co', paidAt: null })
    create.mockResolvedValue({ id: 'cs_1', url: 'https://checkout.stripe.com/c/cs_1' })
    const res = await post({ intakeId: id })
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual({ url: 'https://checkout.stripe.com/c/cs_1' })
    expect(create).toHaveBeenCalledWith({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: 15000,
            product_data: { name: 'Myrakal doctor consult', description: 'Credited toward your treatment' },
          },
        },
      ],
      customer_email: 'a@b.co',
      metadata: { intakeId: id },
      success_url: `http://localhost/case?id=${id}&paid=1`,
      cancel_url: `http://localhost/case?id=${id}`,
    })
    expect(update).toHaveBeenCalledWith({ where: { id }, data: { stripeSessionId: 'cs_1' } })
  })

  it('returns a generic 502 when Stripe fails', async () => {
    findUnique.mockResolvedValue({ id, email: 'a@b.co', paidAt: null })
    create.mockRejectedValue(new Error('sk_test_123 leaked'))
    const res = await post({ intakeId: id })
    expect(res.status).toBe(502)
    expect(await res.text()).not.toMatch(/sk_test/)
  })
})
