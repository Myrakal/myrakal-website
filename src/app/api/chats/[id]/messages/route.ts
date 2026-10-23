import { requireUser } from '@/server/auth'
import { ClaudeNotConfigured, runTurn } from '@/server/claude'
import { db } from '@/server/db'
import { json, sameHost, UUID } from '@/server/http'
import { intakeProgress } from '@/server/intake'

const FALLBACK_REPLY = 'Sorry, I had trouble answering that. Could you try again or repeat it?'
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

  const stored = await db().message.findMany({
    where: { chatId: id },
    orderBy: { createdAt: 'asc' },
    take: HISTORY_LIMIT,
    select: { role: true, text: true },
  })
  const history = [...stored.map((m) => ({ role: m.role as 'user' | 'assistant', text: m.text })), { role: 'user' as const, text }]

  let turn
  try {
    turn = await runTurn({ history, intake: chat.intake })
  } catch (error) {
    return error instanceof ClaudeNotConfigured ? json({ error: 'unavailable' }, 503) : json({ error: 'upstream failure' }, 502)
  }

  const intake = { ...(chat.intake as Record<string, string | boolean>), ...turn.updates }
  const reply = await db().$transaction(async (tx) => {
    const moved = await tx.chat.updateMany({ where: { id, userId: user.id, status: 'intake' }, data: { intake } })
    if (moved.count === 0) return null
    await tx.message.create({ data: { chatId: id, role: 'user', text } })
    return tx.message.create({ data: { chatId: id, role: 'assistant', text: turn.reply || FALLBACK_REPLY } })
  })
  if (!reply) return json({ error: 'conflict' }, 409)

  return json({
    reply: { id: reply.id, role: 'assistant', text: reply.text, createdAt: reply.createdAt },
    status: 'intake',
    progress: intakeProgress(intake),
  })
}
