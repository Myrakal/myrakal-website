import { guardReply } from './reply.ts'

describe('guardReply', () => {
  it('passes a short warm acknowledgement, trimmed', () => {
    expect(guardReply('  Thank you for sharing that. That sounds uncomfortable.\n')).toBe(
      'Thank you for sharing that. That sounds uncomfortable.',
    )
  })

  it('returns an empty string for empty or whitespace replies', () => {
    expect(guardReply('')).toBe('')
    expect(guardReply('   \n ')).toBe('')
  })

  it('rejects replies over 240 characters, and accepts exactly 240', () => {
    expect(guardReply('a'.repeat(240))).toBe('a'.repeat(240))
    expect(guardReply('a'.repeat(241))).toBe('')
  })

  it('rejects any reply that asks a question', () => {
    expect(guardReply('Thanks for telling me. How long has it hurt?')).toBe('')
  })

  it.each(['recommend', 'suggest', 'you should', 'diagnos', 'treatment', 'medication', 'prescri', 'dose'])(
    'rejects advice wording: %s',
    (word) => {
      expect(guardReply(`Thank you. It may help, so ${word} something.`)).toBe('')
      expect(guardReply(`Thank you. ${word.toUpperCase()} something.`)).toBe('')
    },
  )

  it('allows a brief emergency message that points to emergency services', () => {
    const reply = "I'm so sorry you're going through this. Please contact your local emergency services right away."
    expect(guardReply(reply)).toBe(reply)
  })

  it('allows soft advice wording inside an emergency message', () => {
    const reply = "I'd suggest calling your local emergency services right now, or 988 in the US."
    expect(guardReply(reply)).toBe(reply)
    expect(guardReply('You should call emergency services right away.')).toBe(
      'You should call emergency services right away.',
    )
  })

  it('still rejects clinical advice that mentions emergency services', () => {
    expect(guardReply('Call emergency services and take a higher dose of your medication.')).toBe('')
    expect(guardReply('Emergency services can start treatment, so my diagnosis is a heart attack.')).toBe('')
  })

  it('still enforces length and questions on emergency messages', () => {
    expect(guardReply(`Please contact emergency services. ${'a'.repeat(240)}`)).toBe('')
    expect(guardReply('Are you safe? Please contact emergency services.')).toBe('')
  })
})
