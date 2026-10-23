import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const doc = readFileSync(resolve(process.cwd(), 'docs/ops-runbook.md'), 'utf8')

describe('ops runbook', () => {
  it.each(['intake', 'doctor_review', 'plan_ready', 'clarification_review', 'awaiting_payment', 'reservations', 'booked'])(
    'covers the %s status',
    (status) => {
      expect(doc).toContain(status)
    },
  )

  it('names the plan file and bucket', () => {
    expect(doc).toContain('<chat id>_plan.pdf')
    expect(doc).toContain('`plans`')
  })

  it('only references tables and columns that exist in the schema', () => {
    const schema = readFileSync(resolve(process.cwd(), 'prisma/schema.prisma'), 'utf8')
    for (const name of ['chats', 'messages', 'comments', 'price_cents', 'paid_at', 'chat_id', 'user_id'])
      expect(schema).toContain(name)
    expect(doc).not.toMatch(/\bintakes\b/)
  })
})
