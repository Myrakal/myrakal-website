import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const sql = readFileSync(resolve(process.cwd(), 'prisma/migrations/20261022000000_chats/migration.sql'), 'utf8')
const schema = readFileSync(resolve(process.cwd(), 'prisma/schema.prisma'), 'utf8')

describe('chats migration', () => {
  it('creates the status enum with all seven values', () => {
    for (const value of ['intake', 'doctor_review', 'plan_ready', 'clarification_review', 'awaiting_payment', 'reservations', 'booked']) {
      expect(sql).toContain(`'${value}'`)
    }
    expect(sql).toMatch(/CREATE TYPE "ChatStatus"/)
  })

  it('creates chats, messages and comments and drops intakes', () => {
    for (const table of ['chats', 'messages', 'comments']) expect(sql).toMatch(new RegExp(`CREATE TABLE "${table}"`))
    expect(sql).toMatch(/DROP TABLE "intakes"/)
  })

  it('indexes chats by user and creation time and keeps stripe session unique', () => {
    expect(sql).toMatch(/CREATE INDEX "chats_user_id_created_at_idx" ON "chats"\("user_id", "created_at"\)/)
    expect(sql).toMatch(/CREATE UNIQUE INDEX "chats_stripe_session_id_key"/)
  })

  it('enables row level security and revokes anon and authenticated on every new table', () => {
    for (const table of ['chats', 'messages', 'comments']) {
      expect(sql).toMatch(new RegExp(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`))
      for (const role of ['anon', 'authenticated']) {
        expect(sql).toMatch(new RegExp(`IF EXISTS \\(SELECT 1 FROM pg_roles WHERE rolname = '${role}'\\) THEN\\s+REVOKE ALL ON "${table}" FROM ${role};`))
      }
    }
  })

  it('leaves the prisma schema without models or enums', () => {
    expect(schema).not.toMatch(/^model /m)
    expect(schema).not.toMatch(/^enum /m)
  })
})

describe('drop chat tables migration', () => {
  const drop = readFileSync(resolve(process.cwd(), 'prisma/migrations/20261102000000_drop_chat_tables/migration.sql'), 'utf8')

  it('drops comments, messages and chats before the enum, using IF EXISTS', () => {
    const order = ['DROP TABLE IF EXISTS "comments"', 'DROP TABLE IF EXISTS "messages"', 'DROP TABLE IF EXISTS "chats"', 'DROP TYPE IF EXISTS "ChatStatus"']
    const positions = order.map((statement) => drop.indexOf(statement))
    expect(positions.every((position) => position >= 0)).toBe(true)
    expect([...positions].sort((a, b) => a - b)).toEqual(positions)
  })

  it('does not touch intakes', () => {
    expect(drop).not.toMatch(/intakes/)
  })
})
