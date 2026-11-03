import { requireUser } from '@/server/auth'
import { ClaudeNotConfigured, runTurn } from '@/server/claude'
import { db } from '@/server/db'
import { json, sameHost, UUID } from '@/server/http'
import { intakeProgress } from '@/server/intake'
import { messageLimitReached } from '@/server/limits'

const FALLBACK_REPLY = 'Sorry, I had trouble answering that. Could you try again or repeat it?'
const CLOSING_REPLY =
  'Thank you, that is everything we need. A doctor will review your transcript and we will email your plan to you.'
const HISTORY_LIMIT = 200

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!sameHost(request)) return json({ error: 'forbidden' }, 403)
  const user = await requireUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  const { id } = await params
  if (!UUID.test(id)) return json({ error: 'not found' }, 404)
  const body = await request.json().catch(() => null)
  const text = typeof body?.text === 'string' ? body.text.trim() : ''
  if (!text || text.length > 4000) return json({ error: 'invalid text' }, 400)

  const chat = await db().chat.findFirst({ where: { id, userId: user.id }, select: { status: true, intake: true } })
  if (!chat) return json({ error: 'not found' }, 404)
  if (chat.status !== 'intake') return json({ error: 'conflict' }, 409)
  if (await messageLimitReached(id)) return json({ error: 'too many messages' }, 429)

  const stored = await db().message.findMany({
    where: { chatId: id },
    orderBy: { createdAt: 'desc' },
    take: HISTORY_LIMIT,
    select: { role: true, text: true },
  })
  const history = [...stored.reverse().map((m) => ({ role: m.role as 'user' | 'assistant', text: m.text })), { role: 'user' as const, text }]

  let turn
  try {
    turn = await runTurn({ history, intake: chat.intake })
  } catch (error) {
    return error instanceof ClaudeNotConfigured ? json({ error: 'unavailable' }, 503) : json({ error: 'upstream failure' }, 502)
  }

  const { attachmentRequest: _stale, ...kept } = chat.intake as Record<string, string | boolean>
  const intake = { ...kept, ...turn.updates, ...(turn.attachmentRequest && { attachmentRequest: turn.attachmentRequest.label }) }
  const progress = intakeProgress(intake)
  const status = progress.collected === progress.total ? 'doctor_review' : 'intake'
  const reply = await db().$transaction(async (tx) => {
    const moved = await tx.chat.updateMany({ where: { id, userId: user.id, status: 'intake', intake: { equals: chat.intake as object } }, data: status === 'intake' ? { intake } : { intake, status } })
    if (moved.count === 0) return null
    const sentAt = Date.now()
    await tx.message.create({ data: { chatId: id, role: 'user', text, createdAt: new Date(sentAt) } })
    return tx.message.create({
      data: { chatId: id, role: 'assistant', text: status === 'doctor_review' ? CLOSING_REPLY : turn.reply || FALLBACK_REPLY, createdAt: new Date(sentAt + 1) },
    })
  })
  if (!reply) return json({ error: 'conflict' }, 409)

  return json({
    reply: { id: reply.id, role: 'assistant', text: reply.text, createdAt: reply.createdAt },
    status,
    progress,
    attachmentRequest: turn.attachmentRequest ?? null,
  })
}
