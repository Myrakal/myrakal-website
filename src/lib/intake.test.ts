import { INTAKE_COMPLETE, INTAKE_PROMPTS, replyFor } from '@/lib/intake'

describe('intake script', () => {
  it('asks about history, then tests, then insurance, in order', () => {
    expect(INTAKE_PROMPTS.length).toBe(4)
    expect(INTAKE_PROMPTS[0]).toMatch(/symptoms|history|going on/i)
    expect(INTAKE_PROMPTS[1]).toMatch(/labs/i)
    expect(INTAKE_PROMPTS[1]).toMatch(/imaging/i)
    expect(INTAKE_PROMPTS[2]).toMatch(/insurance/i)
    expect(INTAKE_PROMPTS[3]).toMatch(/email/i)
  })

  it('replies with the next question after each answer', () => {
    expect(replyFor(1)).toBe(INTAKE_PROMPTS[0])
    expect(replyFor(2)).toBe(INTAKE_PROMPTS[1])
    expect(replyFor(3)).toBe(INTAKE_PROMPTS[2])
    expect(replyFor(4)).toBe(INTAKE_PROMPTS[3])
  })

  it('says intake is complete after the last answer, and keeps saying so', () => {
    expect(replyFor(5)).toBe(INTAKE_COMPLETE)
    expect(replyFor(9)).toBe(INTAKE_COMPLETE)
  })

  it('only gathers: never suggests or recommends, and defers to a licensed doctor', () => {
    const all = [...INTAKE_PROMPTS, INTAKE_COMPLETE].join(' ')
    expect(all).not.toMatch(/suggest|recommend|you should|diagnos(e|is) is/i)
    expect(INTAKE_COMPLETE).toMatch(/licensed doctor/i)
    expect(INTAKE_COMPLETE).toMatch(/complete/i)
  })
})
