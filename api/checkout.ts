import { consultPriceCents } from '../server/consult.ts'
import { db } from '../server/db.ts'
import { StripeNotConfigured, stripe } from '../server/stripe.ts'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const json = (body: unknown, status: number, headers?: Record<string, string>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })

const methodNotAllowed = () => json({ error: 'Method not allowed' }, 405, { allow: 'POST' })

export { methodNotAllowed as DELETE, methodNotAllowed as GET, methodNotAllowed as PATCH, methodNotAllowed as PUT }

function sameHost(request: Request, origin: string) {
  const forwarded = request.headers.get('x-forwarded-host')?.split(',')[0]?.trim()
  const expected = forwarded || request.headers.get('host') || new URL(request.url).host
  return URL.canParse(origin) && new URL(origin).host === expected
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && !sameHost(request, origin)) return json({ error: 'Forbidden' }, 403)

  let intakeId: unknown
  try {
    intakeId = ((await request.json()) as { intakeId?: unknown })?.intakeId
  } catch {
    return json({ error: 'Invalid JSON' }, 400)
  }
  if (typeof intakeId !== 'string' || !UUID.test(intakeId)) return json({ error: 'Not found' }, 404)

  try {
    const intake = await db().intake.findUnique({ where: { id: intakeId }, select: { id: true, email: true, paidAt: true } })
    if (!intake) return json({ error: 'Not found' }, 404)
    if (intake.paidAt) return json({ error: 'Already paid' }, 409)

    const base = origin ?? new URL(request.url).origin
    const session = await stripe().checkout.sessions.create({
      mode: 'payment',
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: consultPriceCents(),
            product_data: { name: 'Myrakal doctor consult', description: 'Credited toward your treatment' },
          },
        },
      ],
      customer_email: intake.email,
      metadata: { intakeId: intake.id },
      success_url: `${base}/case?id=${intake.id}&paid=1`,
      cancel_url: `${base}/case?id=${intake.id}`,
    })
    await db().intake.update({ where: { id: intake.id }, data: { stripeSessionId: session.id } })
    return json({ url: session.url }, 200)
  } catch (err) {
    if (err instanceof StripeNotConfigured) return json({ error: 'Payments are not configured' }, 503)
    console.error('checkout failed', err instanceof Error ? err.name : 'UnknownError')
    return json({ error: 'Could not start checkout' }, 502)
  }
}
