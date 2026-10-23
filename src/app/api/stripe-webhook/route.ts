import { db } from '@/server/db'
import { json, UUID } from '@/server/http'
import { stripe } from '@/server/stripe'

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!secret) throw new Error('STRIPE_WEBHOOK_SECRET is not set')
  const signature = request.headers.get('stripe-signature')
  if (!signature) return json({ error: 'missing signature' }, 400)
  const payload = await request.text()
  let event
  try {
    event = stripe().webhooks.constructEvent(payload, signature, secret)
  } catch {
    return json({ error: 'invalid signature' }, 400)
  }
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object
    const chatId = session.metadata?.chatId
    if (session.payment_status === 'paid' && chatId && UUID.test(chatId)) {
      await db().chat.updateMany({
        where: { id: chatId, status: 'awaiting_payment' },
        data: { status: 'reservations', paidAt: new Date() },
      })
    }
  }
  return json({ received: true })
}
