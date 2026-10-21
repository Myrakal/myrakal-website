import { db } from '../server/db.ts'
import { markPaid, UUID } from '../server/payment.ts'
import { stripe } from '../server/stripe.ts'

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

export async function POST(request: Request) {
  const signature = request.headers.get('stripe-signature')
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!signature || !secret) return json({ error: 'Invalid signature' }, 400)

  let event
  try {
    event = await stripe().webhooks.constructEventAsync(await request.text(), signature, secret)
  } catch {
    return json({ error: 'Invalid signature' }, 400)
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const intakeId = session.metadata?.intakeId
    if (session.payment_status === 'paid' && intakeId) {
      if (!UUID.test(intakeId)) {
        console.error('paid session with malformed intake id')
        return json({ received: true }, 200)
      }
      try {
        if (!(await markPaid(db(), intakeId))) console.error(`paid session matched no awaiting intake ${intakeId}`)
      } catch (err) {
        console.error('mark paid failed', err instanceof Error ? err.name : 'UnknownError')
        return json({ error: 'Could not record payment' }, 500)
      }
    }
  }
  return json({ received: true }, 200)
}
