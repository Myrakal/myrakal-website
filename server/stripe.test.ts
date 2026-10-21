import { StripeNotConfigured, stripe } from './stripe.ts'

describe('stripe', () => {
  afterEach(() => {
    delete process.env.STRIPE_SECRET_KEY
  })

  it('throws StripeNotConfigured without a key', () => {
    delete process.env.STRIPE_SECRET_KEY
    expect(() => stripe()).toThrow(StripeNotConfigured)
  })

  it('returns a client when the key is set', () => {
    process.env.STRIPE_SECRET_KEY = 'sk_test_123'
    expect(stripe().checkout.sessions.create).toBeTypeOf('function')
  })
})
