import Stripe from 'stripe'

export class StripeNotConfigured extends Error {
  constructor() {
    super('STRIPE_SECRET_KEY is not set')
    this.name = 'StripeNotConfigured'
  }
}

let client: Stripe | undefined

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) throw new StripeNotConfigured()
  client ??= new Stripe(key)
  return client
}
