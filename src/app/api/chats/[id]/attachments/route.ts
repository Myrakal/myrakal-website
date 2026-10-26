import { requireUser } from '@/server/auth'
import { ALLOWED_TYPES, attachmentBucket, MAX_BYTES, MAX_FILES, safeName } from '@/server/attachments'
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
  const form = await request.formData().catch(() => null)
  const file = form?.get('file')
  if (!(file instanceof File) || file.size === 0 || !ALLOWED_TYPES.includes(file.type)) return json({ error: 'invalid file' }, 400)
  if (file.size > MAX_BYTES) return json({ error: 'file too large' }, 413)
  const bucket = attachmentBucket()
  const existing = await bucket.list(id, { limit: MAX_FILES })
  if (existing.error) return json({ error: 'upstream failure' }, 502)
  if (existing.data.length >= MAX_FILES) return json({ error: 'too many files' }, 429)
  const name = safeName(file.name)
  const uploaded = await bucket.upload(`${id}/${crypto.randomUUID()}-${name}`, file, { contentType: file.type })
  if (uploaded.error) return json({ error: 'upstream failure' }, 502)
  const message = await db().message.create({ data: { chatId: id, role: 'user', text: `[Attached: ${name}]` } })
  return json({ message: { id: message.id, role: 'user', text: message.text, createdAt: message.createdAt } })
}
