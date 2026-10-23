import { requireUser } from '@/server/auth'
import { db } from '@/server/db'
import { json, UUID } from '@/server/http'
import { intakeProgress } from '@/server/intake'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  const { id } = await params
  if (!UUID.test(id)) return json({ error: 'not found' }, 404)
  const chat = await db().chat.findFirst({
    where: { id, userId: user.id },
    include: {
      messages: { orderBy: { createdAt: 'asc' } },
      comments: { orderBy: { createdAt: 'asc' } },
    },
  })
  if (!chat) return json({ error: 'not found' }, 404)
  const fallback = Number(process.env.PLAN_PRICE_CENTS) || 15000
  return json({
    id: chat.id,
    status: chat.status,
    createdAt: chat.createdAt,
    priceCents: chat.priceCents ?? fallback,
    paid: chat.paidAt !== null,
    progress: intakeProgress(chat.intake),
    messages: chat.messages.map(({ id, role, text, createdAt }) => ({ id, role, text, createdAt })),
    comments: chat.comments.map(({ id, text, createdAt }) => ({ id, text, createdAt })),
  })
}
