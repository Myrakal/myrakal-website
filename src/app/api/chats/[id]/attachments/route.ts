import { requireUser } from '@/server/auth'
import { ALLOWED_TYPES, attachmentBucket, bucketName, chatFiles, fileType, MAX_BYTES, MAX_FILES, safeName } from '@/server/attachments'
import { db } from '@/server/db'
import { json, sameHost, UUID } from '@/server/http'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  const { id } = await params
  if (!UUID.test(id)) return json({ error: 'not found' }, 404)
  const chat = await db().chat.findFirst({ where: { id, userId: user.id }, select: { id: true } })
  if (!chat) return json({ error: 'not found' }, 404)
  const bucket = attachmentBucket()
  const listed = await bucket.list(id, { limit: 100 })
  if (listed.error) {
    const { status, message } = listed.error as { status?: number | string; message: string }
    if (Number(status) === 404 || /not found/i.test(message)) return json([])
    throw listed.error
  }
  const files = chatFiles(id, listed.data ?? [])
  if (files.length === 0) return json([])
  const signed = await bucket.createSignedUrls(files.map((file) => file.path), 300)
  if (signed.error) throw signed.error
  const urls = new Map(signed.data.map((entry) => [entry.path, entry.signedUrl]))
  return json(files.map((file) => ({ ...file, url: urls.get(file.path) ?? null })))
}

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
  const name = typeof body?.name === 'string' ? body.name : ''
  const type = fileType(name, typeof body?.type === 'string' ? body.type : '')
  const size = Number(body?.size)
  if (!ALLOWED_TYPES.includes(type) || !(size > 0)) return json({ error: 'invalid file' }, 400)
  if (size > MAX_BYTES) return json({ error: 'file too large' }, 413)
  const bucket = attachmentBucket()
  const existing = await bucket.list(id, { limit: MAX_FILES })
  if (existing.error) return json({ error: 'upstream failure' }, 502)
  if (existing.data.length >= MAX_FILES) return json({ error: 'too many files' }, 429)
  const path = `${id}/${crypto.randomUUID()}-${safeName(name)}`
  const signed = await bucket.createSignedUploadUrl(path)
  if (signed.error) return json({ error: 'upstream failure' }, 502)
  return json({ bucket: bucketName(), path, token: signed.data.token, contentType: type })
}
