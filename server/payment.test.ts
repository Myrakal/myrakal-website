import { vi } from 'vitest'
import { markPaid } from './payment.ts'

describe('markPaid', () => {
  it('moves only awaiting_payment intakes to in_review and stamps paidAt', async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 1 })
    const result = await markPaid({ intake: { updateMany } } as never, 'abc')
    expect(updateMany).toHaveBeenCalledWith({
      where: { id: 'abc', consultStatus: 'awaiting_payment' },
      data: { paidAt: expect.any(Date), consultStatus: 'in_review' },
    })
    expect(result).toBe(true)
  })

  it('reports false when nothing was updated', async () => {
    const updateMany = vi.fn().mockResolvedValue({ count: 0 })
    expect(await markPaid({ intake: { updateMany } } as never, 'abc')).toBe(false)
  })
})
