import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const sql = readFileSync(
  resolve(process.cwd(), 'prisma/migrations/20261020000000_create_intakes/migration.sql'),
  'utf8',
)

describe('create_intakes migration', () => {
  it('enables row level security on intakes', () => {
    expect(sql).toMatch(/ALTER TABLE "intakes" ENABLE ROW LEVEL SECURITY;/)
  })

  it('only revokes from anon and authenticated inside guarded blocks that check pg_roles', () => {
    expect(sql).not.toMatch(/^REVOKE/m)
    for (const role of ['anon', 'authenticated']) {
      expect(sql).toMatch(
        new RegExp(`IF EXISTS \\(SELECT 1 FROM pg_roles WHERE rolname = '${role}'\\) THEN\\s+REVOKE ALL ON "intakes" FROM ${role};`),
      )
    }
  })

  it('does not create the public schema', () => {
    expect(sql).not.toMatch(/CREATE SCHEMA/)
  })
})
