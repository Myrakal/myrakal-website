import { requireUser } from '@/server/auth'
import { attachmentBucket, MAX_BYTES } from '@/server/attachments'
import { db } from '@/server/db'
import { json, sameHost, UUID } from '@/server/http'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameHost(request)) return json({ error: 'forbidden' }, 403)
  const user = await requireUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  const { id } = await params
  if (!UUID.test(id)) return json({ error: 'not found' }, 404)
  const chat = await db().chat.findFirst({ where: { id, userId: user.id }, select: { status: true } })
  if (!chat) return json({ error: 'not found' }, 404)
  if (chat.status !== 'intake') return json({ error: 'conflict' }, 409)
  const body = await request.json().catch(() => null)
  const name = typeof body?.path === 'string' ? body.path.match(new RegExp(`^${id}/[0-9a-f-]{36}-([A-Za-z0-9._-]+)$`, 'i'))?.[1] : undefined
  if (!name) return json({ error: 'invalid path' }, 400)
  const bucket = attachmentBucket()
  const stored = await bucket.info(body.path)
  if (stored.error || !stored.data) return json({ error: 'not found' }, 404)
  if ((stored.data.size ?? 0) > MAX_BYTES) {
    await bucket.remove([body.path])
    return json({ error: 'file too large' }, 413)
  }
  const message = await db().message.create({ data: { chatId: id, role: 'user', text: `[Attached: ${name}]` } })
  return json({ message: { id: message.id, role: 'user', text: message.text, createdAt: message.createdAt } })
}
