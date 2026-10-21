import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { CONSULT_STATUS, consultPriceCents } from './consult.ts'

const sql = readFileSync(
  resolve(process.cwd(), 'prisma/migrations/20261020010000_consult_fields/migration.sql'),
  'utf8',
)

describe('consult_fields migration', () => {
  it.each(['consult_status', 'paid_at', 'stripe_session_id', 'consult_note', 'reviewed_at'])('adds %s', (col) => {
    expect(sql).toContain(`"${col}"`)
  })

  it('defaults new intakes to awaiting_payment', () => {
    expect(sql).toMatch(/"consult_status" TEXT NOT NULL DEFAULT 'awaiting_payment'/)
  })

  it('makes the stripe session id unique', () => {
    expect(sql).toMatch(/CREATE UNIQUE INDEX "intakes_stripe_session_id_key"/)
  })
})

describe('consult constants', () => {
  it('lists the statuses in order', () => {
    expect(CONSULT_STATUS).toEqual(['awaiting_payment', 'in_review', 'approved', 'changes_requested'])
  })

  it('defaults the price to $150', () => {
    expect(consultPriceCents({})).toBe(15000)
  })

  it('reads a valid override and ignores junk', () => {
    expect(consultPriceCents({ CONSULT_PRICE_CENTS: '9900' })).toBe(9900)
    expect(consultPriceCents({ CONSULT_PRICE_CENTS: 'abc' })).toBe(15000)
    expect(consultPriceCents({ CONSULT_PRICE_CENTS: '10' })).toBe(15000)
    expect(consultPriceCents({ CONSULT_PRICE_CENTS: '99000000' })).toBe(15000)
  })
})
