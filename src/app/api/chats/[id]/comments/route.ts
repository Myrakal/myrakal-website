import { requireUser } from '@/server/auth'
import { db } from '@/server/db'
import { json, sameHost, UUID } from '@/server/http'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameHost(request)) return json({ error: 'forbidden' }, 403)
  const user = await requireUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  const { id } = await params
  if (!UUID.test(id)) return json({ error: 'not found' }, 404)
  const body = await request.json().catch(() => null)
  const text = typeof body?.text === 'string' ? body.text.trim() : ''
  if (!text || text.length > 4000 || text.includes('\u0000')) return json({ error: 'invalid text' }, 400)
  const result = await db().$transaction(async (tx) => {
    const moved = await tx.chat.updateMany({
      where: { id, userId: user.id, status: 'plan_ready' },
      data: { status: 'clarification_review' },
    })
    if (moved.count === 0) {
      const chat = await tx.chat.findFirst({ where: { id, userId: user.id }, select: { id: true } })
      return chat ? 409 : 404
    }
    await tx.comment.create({ data: { chatId: id, text } })
    return 201
  })
  if (result !== 201) return json({ error: result === 409 ? 'conflict' : 'not found' }, result)
  return json({ status: 'clarification_review' }, 201)
}
