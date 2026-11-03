import { requireUser } from '@/server/auth'
import { db } from '@/server/db'
import { json, sameHost, UUID } from '@/server/http'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameHost(request)) return json({ error: 'forbidden' }, 403)
  const user = await requireUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  const { id } = await params
  if (!UUID.test(id)) return json({ error: 'not found' }, 404)
  const moved = await db().chat.updateMany({
    where: { id, userId: user.id, status: 'plan_ready' },
    data: { status: 'awaiting_payment' },
  })
  if (moved.count === 1) return json({ status: 'awaiting_payment' })
  const chat = await db().chat.findFirst({ where: { id, userId: user.id }, select: { id: true } })
  return chat ? json({ error: 'conflict' }, 409) : json({ error: 'not found' }, 404)
}
