import {
  EMAIL_RETRY,
  extractEmail,
  INTAKE_COMPLETE,
  INTAKE_FAILED,
  INTAKE_PROMPTS,
  replyFor,
  SUPPORT_EMAIL,
} from '@/lib/intake'

describe('intake script', () => {
  it('asks about history, then tests, then insurance, then name, then email, in order', () => {
    expect(INTAKE_PROMPTS.length).toBe(5)
    expect(INTAKE_PROMPTS[0]).toMatch(/symptoms|history|going on/i)
    expect(INTAKE_PROMPTS[1]).toMatch(/labs/i)
    expect(INTAKE_PROMPTS[1]).toMatch(/imaging/i)
    expect(INTAKE_PROMPTS[2]).toMatch(/insurance/i)
    expect(INTAKE_PROMPTS[3]).toMatch(/your name/i)
    expect(INTAKE_PROMPTS[3]).not.toMatch(/email/i)
    expect(INTAKE_PROMPTS[4]).toMatch(/best email to reach you once a licensed doctor has reviewed your case/i)
  })

  it('replies with the next question after each answer', () => {
    expect(replyFor(1)).toBe(INTAKE_PROMPTS[0])
    expect(replyFor(2)).toBe(INTAKE_PROMPTS[1])
    expect(replyFor(3)).toBe(INTAKE_PROMPTS[2])
    expect(replyFor(4)).toBe(INTAKE_PROMPTS[3])
    expect(replyFor(5)).toBe(INTAKE_PROMPTS[4])
  })

  it('says intake is complete after the last answer, and keeps saying so', () => {
    expect(replyFor(6)).toBe(INTAKE_COMPLETE)
    expect(replyFor(9)).toBe(INTAKE_COMPLETE)
  })

  it('only gathers: never suggests or recommends, and defers to a licensed doctor', () => {
    const all = [...INTAKE_PROMPTS, INTAKE_COMPLETE].join(' ')
    expect(all).not.toMatch(/suggest|recommend|you should|diagnos(e|is) is/i)
    expect(INTAKE_COMPLETE).toMatch(/licensed doctor/i)
    expect(INTAKE_COMPLETE).toMatch(/complete/i)
  })
})

describe('extractEmail', () => {
  it('finds an email in a sentence', () => {
    expect(extractEmail('sure, it is ada@example.com')).toBe('ada@example.com')
  })

  it('strips leading and trailing punctuation', () => {
    expect(extractEmail('ada@example.com.')).toBe('ada@example.com')
    expect(extractEmail('(ada@example.com)!')).toBe('ada@example.com')
    expect(extractEmail('email: ada@example.com?')).toBe('ada@example.com')
  })

  it('strips quotes, brackets and braces around the email', () => {
    for (const wrapped of [
      '"ada@example.com"',
      "'ada@example.com'",
      '`ada@example.com`',
      '\u2018ada@example.com\u2019',
      '\u201cada@example.com\u201d',
      '[ada@example.com]',
      '{ada@example.com}',
      'ada@example.com"',
      'ada@example.com\u201d.',
      'it is "ada@example.com", thanks',
    ])
      expect(extractEmail(wrapped)).toBe('ada@example.com')
  })

  it("keeps an apostrophe inside the address: o'brien@example.com", () => {
    const email = "o'brien@example.com"
    for (const text of [
      email,
      `"${email}"`,
      `'${email}'`,
      `[${email}]`,
      `{${email}}`,
      `${email}.`,
      `${email}!`,
      `${email}'`,
      `it is ${email}, thanks`,
      `Patrick, "${email}".`,
    ])
      expect(extractEmail(text)).toBe(email)
    expect(extractEmail("old@example.com, I meant o'brien@example.com")).toBe(email)
  })

  it('still excludes double quotes, backticks, curly quotes, brackets and braces from inside an address', () => {
    expect(extractEmail('ada"x@example.com')).toBe('x@example.com')
    expect(extractEmail('ada`x@example.com')).toBe('x@example.com')
    expect(extractEmail('ada\u2019x@example.com')).toBe('x@example.com')
    expect(extractEmail('ada[x@example.com')).toBe('x@example.com')
    expect(extractEmail('ada{x@example.com')).toBe('x@example.com')
  })

  it('uses the last valid email when several appear', () => {
    expect(extractEmail('old@example.com, sorry, I meant new@example.com')).toBe('new@example.com')
  })

  it('returns null when there is no valid email', () => {
    expect(extractEmail('Ada Lovelace')).toBeNull()
    expect(extractEmail('ada@example')).toBeNull()
    expect(extractEmail('')).toBeNull()
  })
})

describe('contact and failure copy', () => {
  it('asks again for an email politely', () => {
    expect(EMAIL_RETRY).toMatch(/email/i)
    expect(EMAIL_RETRY).toMatch(/thank/i)
  })

  it('points to the real support address if saving fails', () => {
    expect(SUPPORT_EMAIL).toBe('eshaansood@myrakal.com')
    expect(INTAKE_FAILED).toContain(SUPPORT_EMAIL)
    expect(INTAKE_FAILED).not.toMatch(/hello@myrakal\.com/)
  })

  it('closes intake honestly: no invitation to add more here, points to the support email', () => {
    expect(INTAKE_COMPLETE).not.toMatch(/add it here|feel free/i)
    expect(INTAKE_COMPLETE).toContain(SUPPORT_EMAIL)
    expect(INTAKE_COMPLETE).toMatch(/licensed doctor/i)
  })
})
