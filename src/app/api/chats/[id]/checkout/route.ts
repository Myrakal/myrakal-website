import { requireUser } from '@/server/auth'
import { db } from '@/server/db'
import { json, sameHost, UUID } from '@/server/http'
import { stripe } from '@/server/stripe'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameHost(request)) return json({ error: 'forbidden' }, 403)
  const user = await requireUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  const { id } = await params
  if (!UUID.test(id)) return json({ error: 'not found' }, 404)
  const chat = await db().chat.findFirst({
    where: { id, userId: user.id },
    select: { status: true, priceCents: true, stripeSessionId: true },
  })
  if (!chat) return json({ error: 'not found' }, 404)
  if (chat.status !== 'awaiting_payment') return json({ error: 'conflict' }, 409)
  if (chat.stripeSessionId) {
    const existing = await stripe()
      .checkout.sessions.retrieve(chat.stripeSessionId)
      .catch((error: { code?: string }) => {
        if (error?.code === 'resource_missing') return null
        throw error
      })
    if (existing?.status === 'open' && existing.url) return json({ url: existing.url })
  }
  const origin = request.headers.get('origin') ?? new URL(request.url).origin
  const configured = Number(process.env.PLAN_PRICE_CENTS)
  const fallback = Number.isInteger(configured) && configured >= 50 ? configured : 15000
  const session = await stripe().checkout.sessions.create({
    mode: 'payment',
    client_reference_id: id,
    metadata: { chatId: id },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: chat.priceCents ?? fallback,
          product_data: { name: 'Myrakal medical travel plan and reservations' },
        },
      },
    ],
    success_url: `${origin}/chats/${id}?paid=1`,
    cancel_url: `${origin}/chats/${id}`,
  }, { idempotencyKey: `checkout-${id}-${chat.stripeSessionId ?? 'first'}` })
  if (!session.url) throw new Error('Stripe returned a session without a url')
  await db().chat.updateMany({ where: { id, status: 'awaiting_payment' }, data: { stripeSessionId: session.id } })
  return json({ url: session.url })
}
