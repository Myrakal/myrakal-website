import {
  CONTACT_RETRY,
  extractContact,
  INTAKE_COMPLETE,
  INTAKE_FAILED,
  INTAKE_PROMPTS,
  replyFor,
} from '@/lib/intake'

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

describe('extractContact', () => {
  it('reads a name and email separated by a comma', () => {
    expect(extractContact('Ada, ada@example.com')).toEqual({ name: 'Ada', email: 'ada@example.com' })
  })

  it('strips filler like "my name is" and "my email is"', () => {
    expect(extractContact('My name is Ada Lovelace and my email is ada@example.com')).toEqual({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
    })
  })

  it('returns an email with no name when only an email is given', () => {
    expect(extractContact('ada@example.com')).toEqual({ email: 'ada@example.com' })
  })

  it('returns null when there is no valid email', () => {
    expect(extractContact('Ada Lovelace')).toBeNull()
    expect(extractContact('ada@example')).toBeNull()
    expect(extractContact('')).toBeNull()
  })
})

describe('contact and failure copy', () => {
  it('asks again for an email politely', () => {
    expect(CONTACT_RETRY).toMatch(/email/i)
    expect(CONTACT_RETRY).toMatch(/thank/i)
  })

  it('points to the real support address if saving fails', () => {
    expect(INTAKE_FAILED).toContain('eshaansood@myrakal.com')
    expect(INTAKE_FAILED).not.toMatch(/hello@myrakal\.com/)
  })
})
