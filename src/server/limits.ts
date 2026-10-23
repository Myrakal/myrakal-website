import { db } from './db'

export const MAX_CHATS_PER_DAY = 10
export const MAX_MESSAGES_PER_CHAT = 100

const DAY_MS = 24 * 60 * 60 * 1000

export async function chatLimitReached(userId: string) {
  const count = await db().chat.count({ where: { userId, createdAt: { gte: new Date(Date.now() - DAY_MS) } } })
  return count >= MAX_CHATS_PER_DAY
}

export async function messageLimitReached(chatId: string) {
  const count = await db().message.count({ where: { chatId, role: 'user' } })
  return count >= MAX_MESSAGES_PER_CHAT
}
