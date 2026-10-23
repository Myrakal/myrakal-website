import { requireUser } from '@/server/auth'
import { db } from '@/server/db'
import { json, sameHost } from '@/server/http'

export async function POST(request: Request) {
  if (!sameHost(request)) return json({ error: 'forbidden' }, 403)
  const user = await requireUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  const chat = await db().chat.create({ data: { userId: user.id }, select: { id: true } })
  return json({ id: chat.id }, 201)
}

export async function GET() {
  const user = await requireUser()
  if (!user) return json({ error: 'unauthorized' }, 401)
  const chats = await db().chat.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
    take: 100,
    select: { id: true, status: true, createdAt: true, intake: true },
  })
  return json(
    chats.map(({ id, status, createdAt, intake }) => {
      const condition = (intake as { condition?: unknown } | null)?.condition
      return { id, status, createdAt, summary: typeof condition === 'string' ? condition : null }
    }),
  )
}
