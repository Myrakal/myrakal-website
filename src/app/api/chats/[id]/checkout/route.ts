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
    const existing = await stripe().checkout.sessions.retrieve(chat.stripeSessionId).catch(() => null)
    if (existing?.status === 'open' && existing.url) return json({ url: existing.url })
  }
  const origin = new URL(request.url).origin
  const session = await stripe().checkout.sessions.create({
    mode: 'payment',
    client_reference_id: id,
    metadata: { chatId: id },
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: 'usd',
          unit_amount: chat.priceCents ?? (Number(process.env.PLAN_PRICE_CENTS) || 15000),
          product_data: { name: 'Myrakal medical travel plan and reservations' },
        },
      },
    ],
    success_url: `${origin}/chats/${id}?paid=1`,
    cancel_url: `${origin}/chats/${id}`,
  })
  await db().chat.update({ where: { id }, data: { stripeSessionId: session.id } })
  return json({ url: session.url })
}
