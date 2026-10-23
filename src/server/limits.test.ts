const chatCount = jest.fn()
const messageCount = jest.fn()
jest.mock('./db', () => ({ db: () => ({ chat: { count: chatCount }, message: { count: messageCount } }) }))

import { MAX_CHATS_PER_DAY, MAX_MESSAGES_PER_CHAT, chatLimitReached, messageLimitReached } from './limits'

beforeEach(() => jest.resetAllMocks())

describe('chatLimitReached', () => {
  it('counts the user chats created in the last 24 hours', async () => {
    chatCount.mockResolvedValue(0)
    const before = Date.now()
    await chatLimitReached('u1')
    const { where } = chatCount.mock.calls[0][0]
    expect(where.userId).toBe('u1')
    const since = where.createdAt.gte.getTime()
    expect(before - since).toBeGreaterThanOrEqual(24 * 3600 * 1000 - 5)
    expect(before - since).toBeLessThan(24 * 3600 * 1000 + 5000)
  })

  it('is false below the cap and true at it', async () => {
    chatCount.mockResolvedValueOnce(MAX_CHATS_PER_DAY - 1).mockResolvedValueOnce(MAX_CHATS_PER_DAY)
    expect(await chatLimitReached('u1')).toBe(false)
    expect(await chatLimitReached('u1')).toBe(true)
  })
})

describe('messageLimitReached', () => {
  it('counts user messages of the chat', async () => {
    messageCount.mockResolvedValue(0)
    await messageLimitReached('c1')
    expect(messageCount).toHaveBeenCalledWith({ where: { chatId: 'c1', role: 'user' } })
  })

  it('is false below the cap and true at it', async () => {
    messageCount.mockResolvedValueOnce(MAX_MESSAGES_PER_CHAT - 1).mockResolvedValueOnce(MAX_MESSAGES_PER_CHAT)
    expect(await messageLimitReached('c1')).toBe(false)
    expect(await messageLimitReached('c1')).toBe(true)
  })
})
