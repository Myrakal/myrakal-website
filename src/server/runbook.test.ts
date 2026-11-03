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

  it('does not reference the dropped intakes table', () => {
    expect(doc).not.toMatch(/\bintakes\b/)
  })
})
